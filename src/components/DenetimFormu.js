// src/components/DenetimFormu.js
// Tarih: 08.08.2025 Saat: 14:55
// Açıklama: Yeni denetim formu oluşturma, kullanıcıdan konum ve fotoğraf alma ve kaydetme işlemlerini yönetir.
// Veriler, önce API'ye, başarısız olursa IndexedDB'ye kaydedilir.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';

const DenetimFormu = ({ setCurrentView, showMessage, refreshList }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Form maddelerini yükle
        const maddeler = getFormMaddeleri();
        setFormData(maddeler.map(madde => ({ ...madde, durum: null, not: '', foto: null })));

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
                    showMessage('Konum bilgisi alınamadı. Denetim kaydında konum bilgisi olmayacaktır.');
                }
            );
        } else {
            showMessage('Tarayıcınız konum servislerini desteklemiyor.');
        }
    }, [showMessage]);

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
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prevData =>
                prevData.map(madde =>
                    madde.id === maddeId ? { ...madde, foto: reader.result } : madde
                )
            );
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Formda en az bir denetim maddesinin durumunun seçildiğinden emin ol
        const isFormValid = formData.every(madde => madde.durum !== null);
        if (!isFormValid) {
            showMessage('Lütfen tüm kontrol maddelerinin durumunu belirleyin.');
            setLoading(false);
            return;
        }

        const denetim = {
            tarih: new Date().toISOString(),
            konum,
            // API'ye gönderilecek veriyi oluştur
            kontrolListesi: formData.map(({ foto, ...rest }) => ({
                ...rest,
                // Fotoğraf verisi varsa Base64 kısmını al
                foto: foto ? foto.split(',')[1] : null,
            })),
        };

        try {
            // Önce sunucuya kaydetmeyi dene
            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            showMessage('Denetim başarıyla sunucuya kaydedildi!');
        } catch (error) {
            console.error("Denetim sunucuya kaydedilirken hata oluştu, IndexedDB'ye kaydediliyor:", error);
            try {
                // Sunucuya kaydedemezse, IndexedDB'ye kaydet
                await saveDenetim(denetim);
                showMessage('İnternet bağlantısı yok. Denetim yerel depolama alanına kaydedildi.');
            } catch (indexedDBError) {
                console.error("Denetim IndexedDB'ye kaydedilirken hata oluştu:", indexedDBError);
                showMessage('Veri kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setLoading(false);
            // Kaydetme işlemi bittiğinde listeyi yenile ve menüye dön
            refreshList();
            setCurrentView('menu');
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Yeni Denetim Formu</h2>
            <div className="form-content space-y-6">
                {formData.map(madde => (
                    <div key={madde.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-bold text-gray-800 mb-3">{madde.metin}</h4>
                        <div className="flex space-x-2 mb-3">
                            {/* Uygun butonu */}
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${madde.durum === 'Uygun' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}
                                onClick={() => handleDurumChange(madde.id, 'Uygun')}
                                disabled={loading}
                            >
                                Uygun
                            </button>
                            {/* Uygun Değil butonu */}
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${madde.durum === 'Uygun Değil' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-red-100'}`}
                                onClick={() => handleDurumChange(madde.id, 'Uygun Değil')}
                                disabled={loading}
                            >
                                Uygun Değil
                            </button>
                        </div>
                        {madde.durum === 'Uygun Değil' && (
                            <div className="space-y-4 mt-4">
                                <div>
                                    <label htmlFor={`foto-${madde.id}`} className="block text-sm font-medium text-gray-700 mb-1">Kanıt Fotoğrafı:</label>
                                    <input
                                        id={`foto-${madde.id}`}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => handleFotoChange(madde.id, e.target.files[0])}
                                        disabled={loading}
                                    />
                                    {madde.foto && (
                                        <div className="mt-2">
                                            <img src={madde.foto} alt="Kanıt Fotoğrafı" className="max-w-[150px] h-auto rounded-lg shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor={`not-${madde.id}`} className="block text-sm font-medium text-gray-700 mb-1">Not:</label>
                                    <textarea
                                        id={`not-${madde.id}`}
                                        placeholder="Uygunsuzlukla ilgili not ekle..."
                                        rows="2"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        onChange={e => handleNotChange(madde.id, e.target.value)}
                                        value={madde.not}
                                        disabled={loading}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Form kaydetme ve menüye dönme butonları */}
            <div className="mt-8 flex justify-between space-x-4">
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition duration-300 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
                >
                    {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                </button>
                <button 
                    onClick={() => setCurrentView('menu')} 
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold text-gray-800 transition duration-300 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 shadow-md'}`}
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimFormu;
