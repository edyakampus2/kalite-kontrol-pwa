// src/components/DenetimListesi.js
// Tarih: 08.08.2025 Saat: 14:58
// Açıklama: Kaydedilmiş denetimleri listeler. Çevrimdışı durumlarda yerel IndexedDB'den verileri çeker.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';

const DenetimListesi = ({ setCurrentView, setSelectedDenetim, refreshTrigger, showMessage }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Denetim verilerini hem API'den hem de IndexedDB'den çeken ana fonksiyon
        const fetchDenetimler = async () => {
            setLoading(true);
            try {
                // Sunucudan denetimleri getirmeye çalış
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                setDenetimler(response.data.data);
                setError(null);
            } catch (err) {
                console.error("Denetimler sunucudan getirilirken hata oluştu, IndexedDB'den çekiliyor:", err);
                showMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                try {
                    // Sunucudan hata alınırsa, IndexedDB'den verileri çek
                    const indexedDBDenetimler = await getDenetimlerFromIndexedDB();
                    setDenetimler(indexedDBDenetimler);
                    setError(null);
                } catch (indexedDBError) {
                    console.error("IndexedDB'den denetimler getirilirken hata oluştu:", indexedDBError);
                    // Her iki yerden de veri getirilemezse hata mesajı göster
                    setError('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                    showMessage('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDenetimler();
        // `refreshTrigger` değiştiğinde listeyi yeniden getir
    }, [refreshTrigger, showMessage]);

    // Yükleniyor durumunu göster
    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg shadow-md">
                <div className="text-xl text-gray-700">Veriler yükleniyor...</div>
            </div>
        );
    }

    // Hata durumunu göster
    if (error) {
        return (
            <div className="flex items-center justify-center h-48 bg-red-100 text-red-700 rounded-lg shadow-md p-4">
                <p className="text-xl font-semibold">{error}</p>
            </div>
        );
    }

    // Bir denetim maddesine tıklanıldığında çalışacak fonksiyon
    const handleItemClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('detail');
    };

    return (
        <div className="denetim-listesi p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kaydedilmiş Denetimler</h2>

            {denetimler.length > 0 ? (
                <ul className="space-y-4">
                    {denetimler.map(denetim => (
                        <li 
                            key={denetim._id || denetim.id} 
                            onClick={() => handleItemClick(denetim)}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <p className="text-md text-gray-800 font-semibold mb-1">
                                Tarih: <span className="font-normal text-gray-600">{denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}</span>
                            </p>
                            <p className="text-md text-gray-800 font-semibold">
                                Konum: <span className="font-normal text-gray-600">Lat: {denetim.konum?.latitude?.toFixed(4) || 'N/A'}, Lon: {denetim.konum?.longitude?.toFixed(4) || 'N/A'}</span>
                            </p>
                            <span className="text-sm text-blue-500 hover:text-blue-600 mt-2 block">Detayları görmek için tıklayın.</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500 font-medium mb-4">Henüz kaydedilmiş denetim bulunmuyor.</p>
                    <button 
                        onClick={() => setCurrentView('form')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Yeni Denetim Oluştur
                    </button>
                </div>
            )}
            
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={() => setCurrentView('menu')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimListesi;
