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

  // Senkronizasyon işlemi için useEffect
  useEffect(() => {
    const syncOfflineData = async () => {
      // Check if there is an internet connection
      if (navigator.onLine) {
        try {
          // Get saved inspections from IndexedDB
          const offlineDenetimler = await getDenetimlerFromIndexedDB();
          if (offlineDenetimler.length > 0) {
            setModalMessage(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);
            setShowModal(true);

            // Send each inspection to the API
            for (const denetim of offlineDenetimler) {
              await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            }

            // After sending, clear IndexedDB to prevent duplicates
            await clearDenetimlerInIndexedDB();
            setModalMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
            setShowModal(true);
            
            // If we are on the Inspection List or Dashboard page, reload data
            if (currentView === 'list' || currentView === 'dashboard') {
              window.location.reload(); // Refresh the page to fetch new data
            }

          }
        } catch (error) {
          console.error("Çevrimdışı veriler senkronize edilirken hata oluştu:", error);
          setModalMessage('Veri senkronizasyonu sırasında bir hata oluştu.');
          setShowModal(true);
        }
      }
    };

    syncOfflineData();

    // Listen for online/offline connection changes
    window.addEventListener('online', syncOfflineData);
    window.addEventListener('offline', () => {
      console.log('İnternet bağlantısı kesildi.');
    });

    return () => {
      window.removeEventListener('online', syncOfflineData);
      window.removeEventListener('offline', () => {});
    };
  }, [currentView]); // Check synchronization when currentView changes

  const closeModal = () => {
    setShowModal(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu setCurrentView={setCurrentView} />;
      case 'form':
        return <DenetimFormu setCurrentView={setCurrentView} />;
      case 'list':
        return <DenetimListesi setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} />;
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
