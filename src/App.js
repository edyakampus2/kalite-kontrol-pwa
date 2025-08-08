// Tarih: 08.08.2025 Saat: 13:45
// src/App.js

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
  const [currentView, setCurrentView] = useState('menu');
  const [previousView, setPreviousView] = useState(null); // Önceki sayfayı takip etmek için yeni state
  const [selectedDenetim, setSelectedDenetim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Sayfa navigasyonunu yöneten yardımcı fonksiyon
  const navigateTo = (view, data = null) => {
    setPreviousView(currentView);
    setCurrentView(view);
    if (data) {
      setSelectedDenetim(data);
    } else {
      setSelectedDenetim(null);
    }
  };

  useEffect(() => {
    const syncOfflineData = async () => {
      if (navigator.onLine) {
        try {
          const offlineDenetimler = await getDenetimlerFromIndexedDB();
          if (offlineDenetimler.length > 0) {
            setModalMessage(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);
            setShowModal(true);

            for (const denetim of offlineDenetimler) {
              await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            }

            await clearDenetimlerInIndexedDB();
            setModalMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
            setShowModal(true);
            
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

    window.addEventListener('online', syncOfflineData);
    window.addEventListener('offline', () => {
      console.log('İnternet bağlantısı kesildi.');
    });

    return () => {
      window.removeEventListener('online', syncOfflineData);
      window.removeEventListener('offline', () => {});
    };
  }, [currentView]);

  const closeModal = () => {
    setShowModal(false);
  };

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
        return <DenetimDetayi navigateTo={navigateTo} selectedDenetim={selectedDenetim} previousView={previousView} />; // previousView prop'u eklendi
      case 'yedekleme':
        return <Yedekleme navigateTo={navigateTo} />;
      default:
        return <Menu navigateTo={navigateTo} />;
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
