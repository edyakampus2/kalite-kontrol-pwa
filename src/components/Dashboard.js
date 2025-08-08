// Dosya: src/components/Dashboard.js
// Tarih: 08.08.2025
// Saat: 18:05
// Bu dosya, ana bileşen tarafından çağrılan bir "Dashboard" bileşenidir.

// Gerekli React kancalarını ve kütüphanelerini içe aktarıyoruz
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

// Tailwind CSS sınıflarını kullanarak daha iyi bir estetik için stil sabitleri oluşturuyoruz.
const cardStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300 ease-in-out";
const valueStyle = "text-4xl sm:text-5xl font-bold mt-2 text-center text-indigo-600 dark:text-indigo-400";
const labelStyle = "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center uppercase tracking-wide";
const listStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8";
const buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105";

// Dashboard fonksiyonel bileşeni, ana uygulamadan prop'ları alır.
const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => {
    // Bileşenin durumunu yönetmek için gerekli state'leri tanımlıyoruz
    const [dashboardData, setDashboardData] = useState(null);
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // `useEffect` kancası, bileşen yüklendiğinde ve `refreshTrigger` değiştiğinde veri çeker
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true); // Veri çekme başladığında yükleniyor durumunu ayarla
            setError(null);
            let allDenetimler = [];

            // İnternet bağlantısını kontrol et
            if (navigator.onLine) {
                try {
                    // API'dan denetimleri çek
                    const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                    allDenetimler = response.data;
                    console.log('Veriler sunucudan çekildi.');
                    setModalMessage('');
                } catch (apiError) {
                    console.error('API’den veri çekilirken hata oluştu, IndexedDB’den çekiliyor:', apiError);
                    try {
                        // API'dan çekilemezse, IndexedDB'den çekmeyi dene
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
    }, [refreshTrigger, error, modalMessage]); // Bağımlılıklar güncellendi

    // Hata veren `handleDenetimClick` fonksiyonunu düzeltiyoruz
    const handleDenetimClick = (denetim) => {
        // `setSelectedDenetim` prop'unun bir fonksiyon olup olmadığını kontrol et
        if (typeof setSelectedDenetim === 'function') {
            setSelectedDenetim(denetim);
        } else {
            console.error("setSelectedDenetim prop'u bir fonksiyon değil veya eksik.");
        }

        // `setCurrentView` prop'unun bir fonksiyon olup olmadığını kontrol et
        if (typeof setCurrentView === 'function') {
            setCurrentView('denetimDetayi');
        } else {
            console.error("setCurrentView prop'u bir fonksiyon değil veya eksik.");
        }
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) return <div className="p-4 text-center text-gray-700 dark:text-gray-300">Veriler yükleniyor...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Hata: {error}</div>;

    const hatalıDenetimler = denetimler.filter(d => d.kontrolListesi && d.kontrolListesi.some(m => m.durum === 'Uygun Değil'));

    // Bileşenin modern ve estetik görünümü için JSX'i güncelliyoruz
    return (
        <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
                Dashboard
            </h2>
            {dashboardData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Toplam Denetim Kartı */}
                    <div className={cardStyle}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">Toplam Denetim Sayısı</h3>
                        <p className={valueStyle}>{dashboardData.totalDenetimler}</p>
                    </div>

                    {/* Toplam Kontrol Maddesi Kartı */}
                    <div className={cardStyle}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">Toplam Kontrol Maddesi</h3>
                        <p className={valueStyle}>{dashboardData.totalKontrolItems}</p>
                    </div>

                    {/* Uygun Madde Kartı */}
                    <div className={cardStyle}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">Uygun Madde Sayısı</h3>
                        <p className={`${valueStyle} text-green-600 dark:text-green-400`}>{dashboardData.compliantCount}</p>
                    </div>

                    {/* Uygun Olmayan Madde Kartı */}
                    <div className={cardStyle}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">Uygun Olmayan Madde Sayısı</h3>
                        <p className={`${valueStyle} text-red-600 dark:text-red-400`}>{dashboardData.nonCompliantCount}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    <p>Gösterilecek veri bulunamadı.</p>
                </div>
            )}
            
            <div className={listStyle}>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Hatalı Denetimler
                </h3>
                {hatalıDenetimler.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {hatalıDenetimler.map((denetim, index) => (
                            <li
                                key={denetim._id || denetim.id}
                                onClick={() => handleDenetimClick(denetim)}
                                className="py-4 px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                            >
                                <div className="flex justify-between items-center text-gray-900 dark:text-white">
                                    <span className="font-medium">
                                        ({index + 1}) Tarih: {denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}
                                    </span>
                                    <span className="text-sm font-semibold text-red-500">
                                        {denetim.kontrolListesi.filter(item => item.durum === 'Uygun Değil').length} Hata
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 italic">
                        Harika! Henüz hatalı denetim bulunmuyor.
                    </p>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={() => {
                        if (typeof setCurrentView === 'function') {
                            setCurrentView('menu');
                        } else {
                            console.error("setCurrentView prop'u bir fonksiyon değil veya eksik.");
                        }
                    }}
                    className={buttonStyle}
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
