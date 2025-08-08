// Dosya: src/components/Dashboard.js
// Tarih: 08.08.2025
// Saat: 17:55

// React'in temel fonksiyonlarını ve state yönetimini kullanmak için import ediyoruz
import React, { useState, useEffect } from 'react';

// ===== STİL SABİTLERİ =====
// Tailwind CSS sınıflarını kullanarak görsel olarak daha çekici bir tasarım oluşturuyoruz.
const cardStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 m-2 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300 ease-in-out";
const valueStyle = "text-5xl font-bold mt-4 text-center text-indigo-600 dark:text-indigo-400";
const labelStyle = "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center uppercase tracking-wide";
const listStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-8 p-6";

// ===== DASHBOARD BİLEŞENİ =====
// `Dashboard` fonksiyonel bileşeni, `denetimler` verisini ve bir `onSelectDenetim` fonksiyonunu prop olarak alır.
const Dashboard = ({ denetimler, onSelectDenetim }) => {
  // `dashboardData` state'i, dashboard'da gösterilecek tüm hesaplanmış verileri tutar.
  const [dashboardData, setDashboardData] = useState({
    totalDenetim: 0,
    totalMadde: 0,
    uygunMadde: 0,
    uygunOlmayan: 0,
    hataliDenetimler: [],
  });

  // ===== VERİ HESAPLAMA VE GÜNCELLEME =====
  // `useEffect` kancası, `denetimler` prop'u her değiştiğinde çalışır.
  useEffect(() => {
    if (denetimler && denetimler.length > 0) {
      const totalDenetim = denetimler.length;
      let totalMadde = 0;
      let uygunMadde = 0;
      let uygunOlmayan = 0;
      const hataliDenetimler = [];

      denetimler.forEach(denetim => {
        if (denetim.formData && Array.isArray(denetim.formData)) {
          totalMadde += denetim.formData.length;
          let denetimHatali = false;

          denetim.formData.forEach(madde => {
            if (madde.durum === 'Uygun') {
              uygunMadde++;
            } else {
              uygunOlmayan++;
              denetimHatali = true;
            }
          });

          if (denetimHatali) {
            hataliDenetimler.push(denetim);
          }
        }
      });

      setDashboardData({
        totalDenetim,
        totalMadde,
        uygunMadde,
        uygunOlmayan,
        hataliDenetimler,
      });
    } else {
      setDashboardData({
        totalDenetim: 0,
        totalMadde: 0,
        uygunMadde: 0,
        uygunOlmayan: 0,
        hataliDenetimler: [],
      });
    }
  }, [denetimler]);

  // ===== OLAY YÖNETİCİSİ =====
  // `handleSelectDenetim` fonksiyonu, hatalı denetimler listesindeki bir öğeye tıklandığında çağrılır.
  const handleSelectDenetim = (denetim) => {
    // Hatanın oluştuğu satırda, prop'un bir fonksiyon olup olmadığını kontrol ediyoruz.
    // Eğer `onSelectDenetim` bir fonksiyonsa çağır, değilse konsola hata yazdır.
    if (typeof onSelectDenetim === 'function') {
      onSelectDenetim(denetim);
    } else {
      console.error("onSelectDenetim prop'u bir fonksiyon değil veya eksik.");
    }
  };

  // ===== BİLEŞENİN GÖRSEL YAPISI (JSX) =====
  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Denetim Kartı */}
        <div className={cardStyle}>
          <div>
            <div className={valueStyle}>{dashboardData.totalDenetim}</div>
            <div className={labelStyle}>Toplam Denetim</div>
          </div>
        </div>

        {/* Toplam Madde Kartı */}
        <div className={cardStyle}>
          <div>
            <div className={valueStyle}>{dashboardData.totalMadde}</div>
            <div className={labelStyle}>Toplam Madde</div>
          </div>
        </div>

        {/* Uygun Madde Kartı */}
        <div className={cardStyle}>
          <div>
            <div className={valueStyle}>{dashboardData.uygunMadde}</div>
            <div className={labelStyle}>Uygun Madde</div>
          </div>
        </div>

        {/* Uygun Olmayan Kartı */}
        <div className={cardStyle}>
          <div>
            <div className={valueStyle}>{dashboardData.uygunOlmayan}</div>
            <div className={labelStyle}>Uygun Olmayan</div>
          </div>
        </div>
      </div>

      {/* Hatalı Denetimler Listesi Bölümü */}
      <div className={listStyle}>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Hatalı Denetimler
        </h3>
        {/* Eğer hatalı denetimler dizisinde eleman varsa, listeyi render et */}
        {dashboardData.hataliDenetimler.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Hatalı denetimleri listelemek için `map` fonksiyonunu kullanıyoruz */}
            {dashboardData.hataliDenetimler.map(denetim => (
              <li
                key={denetim._id}
                onClick={() => handleSelectDenetim(denetim)}
                className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg px-2"
              >
                <div className="flex justify-between items-center">
                  <div className="text-gray-900 dark:text-white">
                    {/* Denetimin konum adını veya bir fallback metni göster */}
                    <span className="font-medium">{denetim.konum?.name || 'Bilinmeyen Konum'}</span> - 
                    {/* Denetimin tarihini yerel formata dönüştürerek göster */}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(denetim.tarih).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Bu denetimdeki uygun olmayan madde sayısını göster */}
                  <div className="text-red-500 font-semibold">
                    Uygun Olmayan Madde Sayısı: {
                      denetim.formData.filter(item => item.durum !== 'Uygun').length
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Hatalı denetim yoksa bu mesajı göster
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            Harika! Henüz hatalı denetim bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
