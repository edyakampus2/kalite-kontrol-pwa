// src/App.js
// Uygulamanın ana bileşeni ve sayfa yönlendirme mantığını içerir.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Dashboard from './components/Dashboard';
import DenetimDetayi from './components/DenetimDetayi';
import MessageModal from './components/MessageModal';
import Yedekleme from './components/Yedekleme';
import { getDenetimler as getDenetimlerFromIndexedDB, clearDenetimler as clearDenetimlerInIndexedDB } from './services/IndexedDBService';

const App = () => {
    // Uygulamanın o anki görünümünü saklar (örn. 'menu', 'form', 'list').
    const [currentView, setCurrentView] = useState('menu');
    // Geri dönme butonu için bir önceki sayfanın bilgisini saklar.
    const [previousView, setPreviousView] = useState(null);
    // Detayları gösterilecek olan denetim nesnesini saklar.
    const [selectedDenetim, setSelectedDenetim] = useState(null);
    // Modal pencerenin görünürlüğünü yönetir.
    const [showModal, setShowModal] = useState(false);
    // Modal içinde gösterilecek mesajı saklar.
    const [modalMessage, setModalMessage] = useState('');
    // Veri yenileme işlemlerini tetiklemek için kullanılan bir durum değişkeni.
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Yeni bir sayfa geçişi (navigasyon) işlemi için yardımcı fonksiyon.
    const navigateTo = (view, data = null) => {
        // Mevcut görünümü bir önceki görünüm olarak ayarlar.
        setPreviousView(currentView);
        // Yeni görünümü ayarlar.
        setCurrentView(view);
        // Eğer veri varsa, seçilen denetim verisini günceller.
        if (data) {
            setSelectedDenetim(data);
        } else {
            setSelectedDenetim(null);
        }
    };

    // Senkronizasyon işlemi için useEffect hook'u.
    useEffect(() => {
        const syncOfflineData = async () => {
            // İnternet bağlantısı var mı kontrol et.
            if (navigator.onLine) {
                try {
                    // IndexedDB'den kaydedilmiş denetimleri çek.
                    const offlineDenetimler = await getDenetimlerFromIndexedDB();
                    if (offlineDenetimler.length > 0) {
                        setModalMessage(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);
                        setShowModal(true);

                        // Her bir denetimi API'ye gönder.
                        for (const denetim of offlineDenetimler) {
                            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
                        }

                        // Gönderme işlemi bitince IndexedDB'yi temizle.
                        await clearDenetimlerInIndexedDB();
                        setModalMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
                        setShowModal(true);
                        
                        // Senkronizasyon bitince denetim listesinin yenilenmesini tetikle.
                        setRefreshTrigger(prev => !prev);
                    }
                } catch (error) {
                    console.error("Çevrimdışı veriler senkronize edilirken hata oluştu:", error);
                    setModalMessage('Veri senkronizasyonu sırasında bir hata oluştu.');
                    setShowModal(true);
                }
            }
        };

        syncOfflineData();

        // Çevrimiçi/çevrimdışı bağlantı değişimlerini dinle.
        window.addEventListener('online', syncOfflineData);
        window.addEventListener('offline', () => {
            console.log('İnternet bağlantısı kesildi.');
        });

        return () => {
            window.removeEventListener('online', syncOfflineData);
            window.removeEventListener('offline', () => {});
        };
    }, [currentView]); // currentView değiştiğinde senkronizasyonu kontrol et

    // Modal pencereyi kapatma fonksiyonu.
    const closeModal = () => {
        setShowModal(false);
    };

    // Hangi bileşenin gösterileceğini belirleyen fonksiyon.
    const renderView = () => {
        switch (currentView) {
            case 'menu':
                return <Menu navigateTo={navigateTo} />;
            case 'form':
                return <DenetimFormu navigateTo={navigateTo} setRefreshTrigger={setRefreshTrigger} />;
            case 'list':
                return <DenetimListesi navigateTo={navigateTo} refreshTrigger={refreshTrigger} />;
            case 'dashboard':
                return <Dashboard navigateTo={navigateTo} refreshTrigger={refreshTrigger} />;
            case 'denetimDetayi':
                // navigateTo ve previousView prop'larını DenetimDetayi bileşenine gönderir.
                return <DenetimDetayi navigateTo={navigateTo} selectedDenetim={selectedDenetim} previousView={previousView} />;
            case 'yedekleme':
                return <Yedekleme navigateTo={navigateTo} />;
            default:
                return <Menu navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="App">
            {/* Hangi sayfanın gösterileceğini belirleyen fonksiyonu çağırır. */}
            {renderView()}
            {/* Eğer showModal durumu true ise MessageModal bileşenini gösterir. */}
            {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default App;
