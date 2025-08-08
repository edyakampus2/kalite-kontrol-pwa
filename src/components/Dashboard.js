// src/components/Dashboard.js
// Tarih: 08.08.2025 Saat: 14:30

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            let allDenetimler = [];

            if (navigator.onLine) {
                // İnternet varsa, API'den tüm denetimleri çekmeyi dene
                try {
                    const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                    allDenetimler = response.data;
                    console.log('Veriler sunucudan çekildi.');
                    setModalMessage('');
                } catch (apiError) {
                    // API'dan çekilemezse, IndexedDB'ye dön
                    console.error('API’den veri çekilirken hata oluştu, IndexedDB’den çekiliyor:', apiError);
                    try {
                        allDenetimler = await getDenetimlerFromIndexedDB();
                        setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                    } catch (dbError) {
                        setError('Hata: Veriler yerel depodan da alınamadı. Lütfen daha sonra tekrar deneyin.');
                        console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                    }
                }
            } else {
                // İnternet yoksa doğrudan IndexedDB'den çek
                try {
                    allDenetimler = await getDenetimlerFromIndexedDB();
                    setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                } catch (dbError) {
                    setError('Hata: Çevrimdışı modda veriler yerel depodan alınamadı. Lütfen daha sonra tekrar deneyin.');
                    console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                }
            }

            if (allDenetimler.length > 0) {
                // Dashboard verilerini hesapla
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
                setDashboardData(null);
                setDenetimler([]);
            }
            setLoading(false);
            if(modalMessage) setShowModal(true);
        };

        fetchDashboardData();
    }, [refreshTrigger]);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) return <div className="p-4 text-center">Veriler yükleniyor...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Hata: {error}</div>;

    const hatalıDenetimler = denetimler.filter(d => d.kontrolListesi.some(m => m.durum === 'Uygun Değil'));

    return (
        <div className="p-4 denetim-dashboard">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Toplam Denetim Sayısı</h3>
                        <p className="text-4xl font-bold text-blue-600 mt-2">{dashboardData.totalDenetimler}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Toplam Kontrol Maddesi</h3>
                        <p className="text-4xl font-bold text-gray-600 mt-2">{dashboardData.totalKontrolItems}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Uygun Madde Sayısı</h3>
                        <p className="text-4xl font-bold text-green-600 mt-2">{dashboardData.compliantCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Uygun Olmayan Madde Sayısı</h3>
                        <p className="text-4xl font-bold text-red-600 mt-2">{dashboardData.nonCompliantCount}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>Gösterilecek veri bulunamadı.</p>
                </div>
            )}
            <h3 className="text-xl font-bold mt-8 mb-4">Hatalı Denetimler</h3>
            {hatalıDenetimler.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-left">
                    {hatalıDenetimler.map((denetim, index) => (
                        <li key={denetim._id || denetim.id} 
                            onClick={() => handleDenetimClick(denetim)}
                            className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300"
                        >
                            ({index + 1}) Tarih: {denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">Henüz hatalı denetim bulunmuyor.</p>
            )}
            <div className="form-action-buttons mt-8">
                <button 
                    onClick={() => setCurrentView('menu')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    Ana Menüye Dön
                </button>
            </div>
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default Dashboard;
