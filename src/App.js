// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Dashboard from './components/Dashboard';
import DenetimDetayi from './components/DenetimDetayi';
import MessageModal from './components/MessageModal';
import { getDenetimler as getDenetimlerFromIndexedDB, clearDenetimler as clearDenetimlerInIndexedDB } from './services/IndexedDBService';

const App = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedDenetim, setSelectedDenetim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Yeni denetimler için tetikleyici

  // Senkronizasyon işlemi için useEffect
  useEffect(() => {
    const syncOfflineData = async () => {
      // İnternet bağlantısı var mı kontrol et
      if (navigator.onLine) {
        try {
          // IndexedDB'den kaydedilmiş denetimleri çek
          const offlineDenetimler = await getDenetimlerFromIndexedDB();
          if (offlineDenetimler.length > 0) {
            setModalMessage(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);
            setShowModal(true);

            // Her bir denetimi API'ye gönder
            for (const denetim of offlineDenetimler) {
              await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            }

            // Gönderme işlemi bitince IndexedDB'yi temizle
            await clearDenetimlerInIndexedDB();
            setModalMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
            setShowModal(true);
            
            // Senkronizasyon bitince denetim listesinin yenilenmesini tetikle
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

    // Çevrimiçi/çevrimdışı bağlantı değişimlerini dinle
    window.addEventListener('online', syncOfflineData);
    window.addEventListener('offline', () => {
      console.log('İnternet bağlantısı kesildi.');
    });

    return () => {
      window.removeEventListener('online', syncOfflineData);
      window.removeEventListener('offline', () => {});
    };
  }, [currentView]); // currentView değiştiğinde senkronizasyonu kontrol et

  const closeModal = () => {
    setShowModal(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu setCurrentView={setCurrentView} />;
      case 'form':
        return <DenetimFormu setCurrentView={setCurrentView} setRefreshTrigger={setRefreshTrigger} />;
      case 'list':
        return <DenetimListesi setCurrentView={setCurrentView} refreshTrigger={refreshTrigger} />;
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} refreshTrigger={refreshTrigger} />;
      case 'denetimDetayi':
        return <DenetimDetayi setCurrentView={setCurrentView} denetim={selectedDenetim} />;
      default:
        return <Menu setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
      {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default App;
