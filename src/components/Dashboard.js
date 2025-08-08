// src/components/Dashboard.js
// Tarih: 08.08.2025 Saat: 15:05
// Açıklama: Denetim verilerinden özet istatistikler ve hatalı denetimlerin listesini gösterir.
// Mesaj ve modal yönetimi için App.js'ten gelen 'showMessage' fonksiyonunu kullanır.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';

const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger, showMessage }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // API'den veya IndexedDB'den denetim verilerini çeken fonksiyon
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            let allDenetimler = [];

            try {
                // Sunucudan denetimleri getirmeye çalış
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                allDenetimler = response.data.data;
                console.log('Veriler sunucudan çekildi.');
            } catch (apiError) {
                // API'dan çekilemezse, IndexedDB'den çek
                console.error('API’den veri çekilirken hata oluştu, IndexedDB’den çekiliyor:', apiError);
                try {
                    allDenetimler = await getDenetimlerFromIndexedDB();
                    showMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                } catch (dbError) {
                    const errorMessage = 'Hata: Veriler ne sunucudan ne de yerel depodan alınamadı.';
                    setError(errorMessage);
                    showMessage(errorMessage);
                    console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                }
            } finally {
                // Veri işleme ve state güncelleme
                if (allDenetimler.length > 0) {
                    const totalDenetimler = allDenetimler.length;
                    let compliantCount = 0;
                    let nonCompliantCount = 0;
                    let totalKontrolItems = 0;
                    
                    allDenetimler.forEach(denetim => {
                        if (denetim.kontrolListesi) {
                            totalKontrolItems += denetim.kontrolListesi.length;
                            denetim.kontrolListesi.forEach(item => {
                                if (item.durum === 'Uygun') {
                                    compliantCount++;
                                } else if (item.durum === 'Uygun Değil') {
                                    nonCompliantCount++;
                                }
                            });
                        }
                    });

                    setDashboardData({
                        totalDenetimler,
                        compliantCount,
                        nonCompliantCount,
                        totalKontrolItems,
                    });
                    setDenetimler(allDenetimler);
                } else if (!error) {
                    // Veri yoksa dashboard'u sıfırla
                    setDashboardData(null);
                    setDenetimler([]);
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [refreshTrigger, showMessage]);

    // Hatalı denetim detayına gitmek için
    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('detail');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700 animate-pulse">Veriler yükleniyor...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-100 text-red-700 p-8 rounded-lg shadow-md">
                <p className="text-xl font-bold">{error}</p>
            </div>
        );
    }

    const hatalıDenetimler = denetimler.filter(d => d.kontrolListesi && d.kontrolListesi.some(m => m.durum === 'Uygun Değil'));

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Dashboard</h2>
            
            {dashboardData ? (
                <div>
                    {/* Özet istatistik kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-lg font-semibold text-gray-700">Toplam Denetim</h3>
                            <p className="text-5xl font-extrabold text-blue-600 mt-2">{dashboardData.totalDenetimler}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-lg font-semibold text-gray-700">Toplam Madde</h3>
                            <p className="text-5xl font-extrabold text-gray-600 mt-2">{dashboardData.totalKontrolItems}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-lg font-semibold text-gray-700">Uygun Madde</h3>
                            <p className="text-5xl font-extrabold text-green-600 mt-2">{dashboardData.compliantCount}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-lg font-semibold text-gray-700">Uygun Olmayan</h3>
                            <p className="text-5xl font-extrabold text-red-600 mt-2">{dashboardData.nonCompliantCount}</p>
                        </div>
                    </div>
                
                    {/* Hatalı denetimler listesi */}
                    <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Hatalı Denetimler</h3>
                    {hatalıDenetimler.length > 0 ? (
                        <ul className="space-y-4">
                            {hatalıDenetimler.map((denetim) => (
                                <li 
                                    key={denetim._id || denetim.id} 
                                    onClick={() => handleDenetimClick(denetim)}
                                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500 cursor-pointer hover:bg-red-50 transition-colors duration-300"
                                >
                                    <p className="text-lg font-semibold text-gray-800">
                                        Tarih: <span className="font-normal text-gray-600">{denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}</span>
                                    </p>
                                    <p className="text-sm text-red-500 mt-1">
                                        Detaylar için tıklayın.
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                            <p className="text-xl text-gray-500 font-medium">Harika! Henüz hatalı denetim bulunmuyor.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
                    <p className="text-xl font-medium">Gösterilecek veri bulunamadı. Lütfen yeni bir denetim oluşturun.</p>
                    <button 
                        onClick={() => setCurrentView('form')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Yeni Denetim Oluştur
                    </button>
                </div>
            )}

            {/* Ana menüye dön butonu */}
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

export default Dashboard;
