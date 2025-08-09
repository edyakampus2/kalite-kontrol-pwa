// src/components/DenetimFormu.js
// Tarih: 09.08.2025 Saat: 11:15
// Açıklama: Yeni denetim formu oluşturma, kullanıcıdan konum ve fotoğraf alma ve kaydetme işlemlerini yönetir.
// Veriler, önce API'ye, başarısız olursa IndexedDB'ye kaydedilir.
// Hata düzeltmeleri: App.js'den gelen prop'lar ile uyumsuzluk giderildi. Artık setModalMessage, setShowModal ve setRefreshTrigger prop'ları kullanılıyor.
// Tasarım Güncellemesi: Eklenen fotoğraftaki modern tasarıma uygun hale getirildi.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';
import { Switch } from '@headlessui/react';

const DenetimFormu = ({ setCurrentView, setModalMessage, setShowModal, setRefreshTrigger }) => {
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
                    setModalMessage('Konum bilgisi alınamadı. Denetim kaydında konum bilgisi olmayacaktır.');
                    setShowModal(true);
                }
            );
        } else {
            setModalMessage('Tarayıcınız konum servislerini desteklemiyor.');
            setShowModal(true);
        }
    }, [setModalMessage, setShowModal]);

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
            setModalMessage('Lütfen tüm kontrol maddelerinin durumunu belirleyin.');
            setShowModal(true);
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
            setModalMessage('Denetim başarıyla sunucuya kaydedildi!');
            setShowModal(true);
        } catch (error) {
            console.error("Denetim sunucuya kaydedilirken hata oluştu, IndexedDB'ye kaydediliyor:", error);
            try {
                // Sunucuya kaydedemezse, IndexedDB'ye kaydet
                await saveDenetim(denetim);
                setModalMessage('İnternet bağlantısı yok. Denetim yerel depolama alanına kaydedildi.');
                setShowModal(true);
            } catch (indexedDBError) {
                console.error("Denetim IndexedDB'ye kaydedilirken hata oluştu:", indexedDBError);
                setModalMessage('Veri kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                setShowModal(true);
            }
        } finally {
            setLoading(false);
            // Kaydetme işlemi bittiğinde listeyi yenile ve menüye dön
            setRefreshTrigger(prev => !prev);
            setCurrentView('menu');
        }
    };

    const StatusSwitch = ({ madde, handleDurumChange, loading }) => {
        const isUygun = madde.durum === 'Uygun';
        const isUygunDegil = madde.durum === 'Uygun Değil';
    
        return (
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Durum:</span>
                <Switch
                    checked={isUygunDegil}
                    onChange={() => {
                        const newDurum = isUygunDegil ? 'Uygun' : 'Uygun Değil';
                        handleDurumChange(madde.id, newDurum);
                    }}
                    disabled={loading}
                    className={`${
                        isUygunDegil ? 'bg-red-500' : 'bg-green-500'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    <span
                        className={`${
                            isUygunDegil ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </Switch>
                <span className={`text-sm font-semibold ml-2 ${isUygunDegil ? 'text-red-500' : 'text-green-500'}`}>
                    {isUygunDegil ? 'Uygun Değil' : 'Uygun'}
                </span>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Yeni Denetim Formu</h2>
            <div className="form-content space-y-6">
                {formData.map(madde => (
                    <div key={madde.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">{madde.metin}</h4>
                        <StatusSwitch madde={madde} handleDurumChange={handleDurumChange} loading={loading} />

                        {madde.durum === 'Uygun Değil' && (
                            <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="space-y-2">
                                    <label htmlFor={`not-${madde.id}`} className="block text-sm font-medium text-gray-700">Not:</label>
                                    <textarea
                                        id={`not-${madde.id}`}
                                        placeholder="Uygunsuzlukla ilgili not ekle..."
                                        rows="2"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
                                        onChange={e => handleNotChange(madde.id, e.target.value)}
                                        value={madde.not}
                                        disabled={loading}
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`foto-${madde.id}`} className="block text-sm font-medium text-gray-700">Kanıt Fotoğrafı:</label>
                                    <input
                                        id={`foto-${madde.id}`}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150 ease-in-out cursor-pointer"
                                        onChange={e => handleFotoChange(madde.id, e.target.files[0])}
                                        disabled={loading}
                                    />
                                    {madde.foto && (
                                        <div className="mt-4">
                                            <img src={madde.foto} alt="Kanıt Fotoğrafı" className="max-w-[150px] h-auto rounded-lg shadow-md border border-gray-300" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Form kaydetme ve menüye dönme butonları */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className={`w-full sm:w-auto py-3 px-6 rounded-lg font-bold text-white transition duration-300 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
                >
                    {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                </button>
                <button 
                    onClick={() => setCurrentView('menu')} 
                    disabled={loading}
                    className={`w-full sm:w-auto py-3 px-6 rounded-lg font-bold text-gray-800 transition duration-300 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 shadow-md'}`}
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimFormu;
