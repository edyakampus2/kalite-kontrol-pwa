// src/components/DenetimFormu.js
// Tarih: 09.08.2025 Saat: 13:30 (Düzeltme)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';
import MessageModal from './MessageModal';

const DenetimFormu = ({ setCurrentView, setRefreshTrigger }) => {
    // Form verilerini ve durumunu yöneten state'ler
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // Form maddelerini yükle
        const maddeler = getFormMaddeleri();
        setFormData(maddeler);

        // Kullanıcının konumunu al
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

    // Form maddesi durumunu güncelleyen fonksiyon
    const handleDurumChange = (maddeId, durum) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, durum } : madde
            )
        );
    };

    // Not alanını güncelleyen fonksiyon
    const handleNotChange = (maddeId, not) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, not } : madde
            )
        );
    };

    // Fotoğrafı güncelleyen fonksiyon (Base64 olarak kaydeder)
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

    // Formu gönderen ve kaydeden fonksiyon
    const handleSubmit = async () => {
        setLoading(true);
        const denetim = {
            tarih: new Date().toISOString(),
            konum,
            kontrolListesi: formData.map(({ foto, ...rest }) => ({
                ...rest,
                // Fotoğraf verisi varsa Base64 kısmını al
                foto: foto ? foto.split(',')[1] : null,
            })),
        };

        try {
            // Önce sunucuya kaydetmeyi dene
            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            setModalMessage('Denetim başarıyla sunucuya kaydedildi!');
        } catch (error) {
            console.error("Denetim sunucuya kaydedilirken hata oluştu, IndexedDB'ye kaydediliyor:", error);
            try {
                // Sunucuya kaydedemezse, IndexedDB'ye kaydet
                await saveDenetim(denetim);
                setModalMessage('İnternet bağlantısı yok. Denetim yerel depolama alanına kaydedildi.');
            } catch (indexedDBError) {
                console.error("Denetim IndexedDB'ye kaydedilirken hata oluştu:", indexedDBError);
                setModalMessage('Veri kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setLoading(false);
            // Modal'ın görünürlüğünü ayarla
            setShowModal(true);
            // Denetim listesinin yenilenmesi için tetikleyiciyi güncelle
            setRefreshTrigger(prev => !prev);
        }
    };
    
    // Modal'ı kapatan fonksiyon
    const closeModal = () => {
        setShowModal(false);
        // Modal kapatıldığında ana menüye dön
        setCurrentView('menu');
    };

    return (
        <div className="denetim-formu p-4 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Yeni Denetim Formu</h2>
            
            <div className="form-action-buttons flex justify-between mb-6">
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
            
            <div className="space-y-4">
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

            {/* Modal bileşeninin görünürlüğü 'showModal' state'ine bağlı olarak kontrol edilir. */}
            {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default DenetimFormu;
