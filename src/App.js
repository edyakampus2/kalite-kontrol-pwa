// src/App.js
// Tarih: 09.08.2025 Saat: 13:45 (Güncellenmiş)
// Açıklama: Uygulamanın ana bileşenidir ve tüm görünümlerin,
// mesaj modalının ve çevrimdışı senkronizasyonun durumunu merkezi olarak yönetir.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Dashboard from './components/Dashboard';
import DenetimDetayi from './components/DenetimDetayi';
import Yedekleme from './components/Yedekleme';
import MessageModal from './components/MessageModal';
import { getDenetimler as getDenetimlerFromIndexedDB, clearDenetimler as clearDenetimlerInIndexedDB } from './services/IndexedDBService';

const App = () => {
    // Uygulama genelinde paylaşılan durumları yöneten state'ler
    const [currentView, setCurrentView] = useState('menu');
    const [selectedDenetim, setSelectedDenetim] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(false); // Yeni denetimler için tetikleyici

    // Modal'ı gösteren ve mesajını ayarlayan merkezi fonksiyon
    const handleShowModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    // Modal'ı kapatan ve view'ı menüye çeviren fonksiyon
    const handleCloseModal = () => {
        setShowModal(false);
        setRefreshTrigger(prev => !prev); // Liste veya dashboard'ı yenile
        setCurrentView('menu'); // İşlem bitince ana menüye dön
    };
    
    // Yalnızca çevrimdışı senkronizasyon için modalı kapatan fonksiyon
    const handleCloseOfflineModal = () => {
        setShowModal(false);
    }

    // Senkronizasyon işlemi için useEffect
    useEffect(() => {
        const syncOfflineData = async () => {
            if (navigator.onLine) {
                try {
                    const offlineDenetimler = await getDenetimlerFromIndexedDB();
                    if (offlineDenetimler.length > 0) {
                        handleShowModal(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);

                        for (const denetim of offlineDenetimler) {
                            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
                        }

                        await clearDenetimlerInIndexedDB();
                        setModalMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
                        
                        setRefreshTrigger(prev => !prev);
                    }
                } catch (error) {
                    console.error("Çevrimdışı veriler senkronize edilirken hata oluştu:", error);
                    setModalMessage('Veri senkronizasyonu sırasında bir hata oluştu.');
                } finally {
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                    }, 3000); // 3 saniye sonra modalı kapat
                }
            }
        };

        syncOfflineData();

        window.addEventListener('online', syncOfflineData);
        const handleOffline = () => {
            console.log('İnternet bağlantısı kesildi.');
        };
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', syncOfflineData);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const renderView = () => {
        switch (currentView) {
            case 'menu':
                return <Menu setCurrentView={setCurrentView} />;
            case 'form':
                // DenetimFormu'na modal yönetimi için merkezi fonksiyonları iletiyoruz
                return <DenetimFormu handleShowModal={handleShowModal} handleCloseModal={handleCloseModal} />;
            case 'list':
                return <DenetimListesi setCurrentView={setCurrentView} refreshTrigger={refreshTrigger} />;
            case 'dashboard':
                return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} refreshTrigger={refreshTrigger} />;
            case 'denetimDetayi':
                return <DenetimDetayi setCurrentView={setCurrentView} denetim={selectedDenetim} />;
            case 'yedekleme':
                return <Yedekleme setCurrentView={setCurrentView} />;
            default:
                return <Menu setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="App">
            {renderView()}
            {/* Modal bileşeni ana App.js içinde render ediliyor, böylece her zaman görünebilir */}
            {showModal && (
                <MessageModal
                    message={modalMessage}
                    // Eğer modalı kapatmak için bir işlem yapılması gerekiyorsa (örneğin view değiştirmek),
                    // bu fonksiyonu kullanırız. Aksi takdirde sadece modalı kapatır.
                    onClose={modalMessage.includes('başarıyla kaydedildi') ? handleCloseModal : handleCloseOfflineModal}
                />
            )}
        </div>
    );
};

export default App;
