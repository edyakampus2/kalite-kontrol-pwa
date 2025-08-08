// Tarih: 08.08.2025 Saat: 13:30
// Açıklama: Bu dosya, uygulamanın ana bileşenidir ve farklı görünümleri (menü, form, liste, vb.) yönetir.

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
  const [selectedDenetim, setSelectedDenetim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Kullanıcıya mesaj göstermek için merkezi fonksiyon
  const showMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };
  
  // Denetim listesini yenilemek için merkezi fonksiyon
  const refreshList = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Çevrimdışı verileri senkronize etme mantığı
  useEffect(() => {
    const syncOfflineData = async () => {
      if (navigator.onLine) {
        try {
          const offlineDenetimler = await getDenetimlerFromIndexedDB();
          if (offlineDenetimler.length > 0) {
            showMessage(`${offlineDenetimler.length} adet çevrimdışı denetim sunucuya yükleniyor...`);

            for (const denetim of offlineDenetimler) {
              await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            }

            await clearDenetimlerInIndexedDB();
            showMessage('Tüm çevrimdışı denetimler başarıyla senkronize edildi.');
            
            // Senkronizasyon sonrası listeyi yenile
            refreshList();
          }
        } catch (error) {
          console.error("Çevrimdışı veriler senkronize edilirken hata oluştu:", error);
          showMessage('Veri senkronizasyonu sırasında bir hata oluştu.');
        }
      }
    };

    // Uygulama yüklendiğinde ve internet bağlantısı geldiğinde senkronizasyonu başlat
    window.addEventListener('online', syncOfflineData);
    syncOfflineData();
    
    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, []); // Bağımlılık dizisini boş bırakarak sadece bileşen mount edildiğinde çalışmasını sağla

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu setCurrentView={setCurrentView} />;
      case 'form':
        return <DenetimFormu setCurrentView={setCurrentView} showMessage={showMessage} refreshList={refreshList} />;
      case 'list':
        return <DenetimListesi setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} refreshTrigger={refreshTrigger} />;
      case 'detail':
        return <DenetimDetayi setCurrentView={setCurrentView} denetim={selectedDenetim} />;
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} refreshTrigger={refreshTrigger} />;
      case 'backup':
        return <Yedekleme setCurrentView={setCurrentView} showMessage={showMessage} refreshList={refreshList} />;
      default:
        return <Menu setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kalite Kontrol PWA</h1>
      </header>
      <main>
        {renderView()}
      </main>
      <MessageModal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default App;
