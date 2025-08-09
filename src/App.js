// Tarih: 09.08.2025 Saat: 10:30
// Açıklama: Bu dosya, uygulamanın ana bileşenidir ve farklı görünümler arasında geçiş yaparak kullanıcı arayüzünü yönetir.
// Aynı zamanda, çevrimdışı kaydedilen denetim verilerini internet bağlantısı kurulduğunda sunucuya senkronize etme işlevini de yerine getirir.
// Hatalar düzeltildi:
// 1. useEffect bağımlılık dizisi boş dizi [] olarak güncellendi.
// 2. Olay dinleyicileri (online/offline) için doğru temizleme fonksiyonu eklendi.
// 3. DenetimDetayi bileşenine gönderilen prop adı denetim={selectedDenetim} olarak düzeltildi.
// 4. Modal durumu güncellemeleri optimize edildi.

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
            
            // Senkronizasyon bitince denetim listesinin yenilenmesini tetikle
            setRefreshTrigger(prev => !prev);
          }
        } catch (error) {
          console.error("Çevrimdışı veriler senkronize edilirken hata oluştu:", error);
          setModalMessage('Veri senkronizasyonu sırasında bir hata oluştu.');
        } finally {
          // İşlem başarılı da olsa başarısız da olsa modalı kapat
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 3000); // 3 saniye sonra modalı kapat
        }
      }
    };

    // Sayfa yüklendiğinde bir kez senkronizasyon yap
    syncOfflineData();

    // Çevrimiçi/çevrimdışı bağlantı değişimlerini dinle
    window.addEventListener('online', syncOfflineData);
    const handleOffline = () => {
      console.log('İnternet bağlantısı kesildi.');
    };
    window.addEventListener('offline', handleOffline);

    // useEffect temizleme fonksiyonu, bileşen kaldırıldığında olay dinleyicilerini kaldırır
    return () => {
      window.removeEventListener('online', syncOfflineData);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Bağımlılık dizisi boş, bu yüzden sadece bir kez çalışır

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
        // Hata düzeltmesi: Prop adı denetim olarak güncellendi.
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
      {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default App;
