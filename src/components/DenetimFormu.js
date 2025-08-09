// src/components/DenetimFormu.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Yeni bir denetim kaydı oluşturmak için kullanılan form bileşeni.
// Kayıt işlemini IndexedDB'ye veya API'ye kaydeder ve sonuç hakkında App.js'teki modalı çağırır.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';

const DenetimFormu = ({ setCurrentView, handleShowModal, handleCloseModal }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const maddeler = getFormMaddeleri();
        setFormData(maddeler);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setKonum({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Konum bilgisi alınamadı:", error);
                }
            );
        }
    }, []);

    const handleDurumChange = (maddeId, durum) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, durum } : madde
            )
        );
    };

    const handleNotChange = (maddeId, not) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, not } : madde
            )
        );
    };

    const handleFotoChange = (maddeId, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prevData =>
                prevData.map(madde =>
                    madde.id === maddeId ? { ...madde, foto: reader.result } : madde
                )
            );
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const denetim = {
            tarih: new Date().toISOString(),
            konum,
            kontrolListesi: formData.map(({ foto, ...rest }) => ({
                ...rest,
                foto: foto ? foto.split(',')[1] : null,
            })),
        };

        try {
            // Sunucuya kaydetme denemesi
            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            handleShowModal('Denetim başarıyla sunucuya kaydedildi!');
        } catch (error) {
            console.error("Denetim sunucuya kaydedilirken hata oluştu, IndexedDB'ye kaydediliyor:", error);
            try {
                // Sunucuya kaydedilemezse IndexedDB'ye kaydetme denemesi
                await saveDenetim(denetim);
                handleShowModal('İnternet bağlantısı yok. Denetim yerel depolama alanına kaydedildi.');
            } catch (indexedDBError) {
                console.error("Denetim IndexedDB'ye kaydedilirken hata oluştu:", indexedDBError);
                handleShowModal('Veri kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="denetim-formu p-4 bg-gray-100 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Yeni Denetim Formu</h2>
            
            <div className="space-y-4 mb-6">
                {formData.map(madde => (
                    <div key={madde.id} className="kontrol-maddesi bg-white p-4 rounded-xl shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-lg text-gray-700">{madde.madde}</h4>
                            <div className="durum-secenekleri flex space-x-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${madde.id}`}
                                        value="Uygun"
                                        checked={madde.durum === 'Uygun'}
                                        onChange={() => handleDurumChange(madde.id, 'Uygun')}
                                        className="form-radio h-5 w-5 text-green-600"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Uygun</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${madde.id}`}
                                        value="Uygun Değil"
                                        checked={madde.durum === 'Uygun Değil'}
                                        onChange={() => handleDurumChange(madde.id, 'Uygun Değil')}
                                        className="form-radio h-5 w-5 text-red-600"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Uygun Değil</span>
                                </label>
                            </div>
                        </div>
                        
                        {madde.durum === 'Uygun Değil' && (
                            <div className="uygun-degil-detayları mt-4 space-y-3">
                                <textarea
                                    placeholder="Not ekle..."
                                    value={madde.not || ''}
                                    onChange={e => handleNotChange(madde.id, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200 ease-in-out"
                                ></textarea>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={e => handleFotoChange(madde.id, e.target.files[0])}
                                        className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-red-50 file:text-red-700
                                                    hover:file:bg-red-100 cursor-pointer"
                                    />
                                    {madde.foto && (
                                        <img 
                                            src={madde.foto} 
                                            alt="Kanıt" 
                                            className="w-20 h-20 object-cover rounded-md shadow-inner border border-gray-300" 
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-action-buttons flex justify-between mt-6">
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="flex-1 py-3 px-6 mr-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                >
                    {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                </button>
                <button 
                    onClick={() => setCurrentView('menu')} 
                    disabled={loading}
                    className="flex-1 py-3 px-6 ml-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300 ease-in-out"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimFormu;
