// Dosya: src/components/Dashboard.js
// Tarih: 08.08.2025
// Saat: 17:30

// React'in temel fonksiyonlarını ve state yönetimini kullanmak için import ediyoruz
import React, { useState, useEffect } from 'react';
// Denetim modelini import ediyoruz (eğer varsa, kodu daha okunabilir hale getirmek için)
import { Denetim } from '../models/Denetim';

// ===== STİL SABİTLERİ =====
// Tailwind CSS sınıflarını kullanarak görsel olarak daha çekici bir tasarım oluşturuyoruz.
// Bu sınıflar, kartlar, değerler, etiketler ve butonlar için tekrar kullanılabilir stiller sağlar.
const cardStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 m-2 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300 ease-in-out";
const valueStyle = "text-5xl font-bold mt-4 text-center text-indigo-600 dark:text-indigo-400";
const labelStyle = "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center uppercase tracking-wide";
const listStyle = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-8 p-6";

// ===== DASHBOARD BİLEŞENİ =====
// `Dashboard` fonksiyonel bileşeni, `denetimler` verisini ve bir `onSelectDenetim` fonksiyonunu prop olarak alır.
// `denetimler`: Sunucudan veya IndexedDB'den gelen denetim verilerinin dizisi.
// `onSelectDenetim`: Bir denetim seçildiğinde çağrılacak geri çağırma fonksiyonu.
const Dashboard = ({ denetimler, onSelectDenetim }) => {
  // `dashboardData` state'i, dashboard'da gösterilecek tüm hesaplanmış verileri tutar.
  // Başlangıçta tüm değerler sıfır veya boş bir dizi olarak ayarlanır.
  const [dashboardData, setDashboardData] = useState({
    totalDenetim: 0,
    totalMadde: 0,
    uygunMadde: 0,
    uygunOlmayan: 0,
    hataliDenetimler: [],
  });

  // ===== VERİ HESAPLAMA VE GÜNCELLEME =====
  // `useEffect` kancası, `denetimler` prop'u her değiştiğinde çalışır.
  // Bu, yeni veri geldiğinde dashboard'un otomatik olarak güncellenmesini sağlar.
  useEffect(() => {
    // Eğer `denetimler` verisi varsa ve boş değilse hesaplama işlemine başla
    if (denetimler && denetimler.length > 0) {
      // Toplam denetim sayısını doğrudan dizinin uzunluğundan al
      const totalDenetim = denetimler.length;

      // Sayaçları ve hatalı denetimler dizisini başlat
      let totalMadde = 0;
      let uygunMadde = 0;
      let uygunOlmayan = 0;
      const hataliDenetimler = [];

      // Her bir denetimi tek tek döngüye al
      denetimler.forEach(denetim => {
        // Her denetimin içindeki `formData` dizisinin varlığını ve tipini kontrol et
        if (denetim.formData && Array.isArray(denetim.formData)) {
          // Bu denetimdeki toplam madde sayısını `totalMadde` sayacına ekle
          totalMadde += denetim.formData.length;
          let denetimHatali = false;

          // Denetimdeki her bir maddeyi (form öğesini) döngüye al
          denetim.formData.forEach(madde => {
            // Maddenin `durum` özelliğini kontrol et
            // Varsayım: `durum` özelliği 'Uygun' veya 'Uygun değil' değerlerini alıyor
            // Kendi uygulamanızdaki doğru özelliği ve değerleri buraya yazmalısınız.
            if (madde.durum === 'Uygun') {
              // Eğer madde uygunsa `uygunMadde` sayacını artır
              uygunMadde++;
            } else {
              // Aksi takdirde, yani uygun değilse, `uygunOlmayan` sayacını artır
              uygunOlmayan++;
              // Bu denetimin hatalı olduğunu işaretle
              denetimHatali = true;
            }
          });

          // Eğer denetimde en az bir hatalı madde varsa (denetimHatali === true),
          // bu denetimi `hataliDenetimler` dizisine ekle
          if (denetimHatali) {
            hataliDenetimler.push(denetim);
          }
        }
      });

      // Hesaplanan tüm değerleri state'e set et. Bu, bileşenin yeniden render edilmesini tetikler.
      setDashboardData({
        totalDenetim,
        totalMadde,
        uygunMadde,
        uygunOlmayan,
        hataliDenetimler,
      });
    } else {
      // Eğer `denetimler` dizisi boşsa veya tanımsızsa, tüm değerleri sıfırla
      setDashboardData({
        totalDenetim: 0,
        totalMadde: 0,
        uygunMadde: 0,
        uygunOlmayan: 0,
        hataliDenetimler: [],
      });
    }
  }, [denetimler]); // Bu efekt, yalnızca `denetimler` dizisi değiştiğinde yeniden çalışır

  // ===== OLAY YÖNETİCİSİ =====
  // `handleSelectDenetim` fonksiyonu, hatalı denetimler listesindeki bir öğeye tıklandığında çağrılır.
  // Prop olarak gelen `onSelectDenetim` fonksiyonunu, seçilen denetim verisiyle birlikte çağırır.
  const handleSelectDenetim = (denetim) => {
    onSelectDenetim(denetim);
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
