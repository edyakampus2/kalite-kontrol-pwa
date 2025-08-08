// Tarih: 08.08.2025
// Açıklama: Proje için tüm bileşenleri ve servisleri içeren tek bir dosya.
// Bu sürüm, kullanılmayan 'axios' importunu kaldırarak ve Denetim Formu'nu ekleyerek
// derleme hatasını giderir. Gerekli servisler ve bileşenler, kodun içinde mock olarak tanımlanmıştır.

import React, { useState, useEffect } from 'react';

// --- Hizmetler ve Yardımcı Bileşenler ---
// 'IndexedDBService' için mock implementasyon. Dosya yolu hatasını çözmek için burada tanımlanmıştır.
const getDenetimler = async () => {
  console.log("IndexedDB'den denetimler alınıyor (Mock)...");
  // Sahte veri döndürme
  return [
    {
      id: 1,
      tarih: new Date().toISOString(),
      formData: [{ durum: 'Uygun Değil' }],
      kontrolListesi: [{ metin: "Kontrol 1", durum: "Uygun Değil", not: "Hata notu" }]
    },
    {
      id: 2,
      tarih: new Date().toISOString(),
      formData: [{ durum: 'Uygun' }],
      kontrolListesi: [{ metin: "Kontrol 2", durum: "Uygun" }]
    }
  ];
};

// 'MessageModal' için mock implementasyon. Dosya yolu hatasını çözmek için burada tanımlanmıştır.
const MessageModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto text-center">
                <p className="text-gray-800 text-lg mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Tamam
                </button>
            </div>
        </div>
    );
};

// --- Uygulama Bileşenleri ---

// Menu Bileşeni
const Menu = ({ setCurrentView }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Kalite Kontrol Uygulaması</h1>
            <div className="space-y-4 w-full max-w-sm">
                <button
                    onClick={() => setCurrentView('denetimFormu')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Yeni Denetim Başlat
                </button>
                <button
                    onClick={() => setCurrentView('denetimListesi')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Denetim Listesi
                </button>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
};

// DenetimFormu Bileşeni
const DenetimFormu = ({ setCurrentView }) => {
    // Kontrol listesi için örnek veri
    const initialKontrolListesi = [
        { metin: "Ekipmanlar kontrol edildi mi?", durum: null, not: "" },
        { metin: "Çalışma alanı temiz mi?", durum: null, not: "" },
        { metin: "Güvenlik önlemleri alındı mı?", durum: null, not: "" },
        { metin: "Kalite standartları karşılanıyor mu?", durum: null, not: "" },
    ];
    
    const [kontrolListesi, setKontrolListesi] = useState(initialKontrolListesi);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleDurumChange = (index, durum) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].durum = durum;
        setKontrolListesi(yeniListe);
    };

    const handleNotChange = (index, not) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].not = not;
        setKontrolListesi(yeniListe);
    };

    const handleKaydet = () => {
        // Formun tamamlandığından emin olmak için bir kontrol yapabilirsiniz
        const eksikKontroller = kontrolListesi.filter(item => item.durum === null);
        if (eksikKontroller.length > 0) {
            setMessage('Lütfen tüm kontrol maddelerini doldurun.');
            setShowModal(true);
            return;
        }

        // Burada veriyi işleme (örneğin IndexedDB'ye kaydetme) mantığı gelebilir.
        // Şimdilik sadece konsola yazdırıyoruz.
        console.log('Denetim Sonuçları:', kontrolListesi);
        setMessage('Denetim başarıyla kaydedildi!');
        setShowModal(true);
        // Ana menüye dönmek için butona tıklanana kadar bekleyelim
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-inter">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Yeni Denetim Formu</h2>
                
                <div className="space-y-6">
                    {kontrolListesi.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.metin}</h3>
                            <div className="flex items-center space-x-4 mb-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${index}`}
                                        value="Uygun"
                                        checked={item.durum === 'Uygun'}
                                        onChange={() => handleDurumChange(index, 'Uygun')}
                                        className="form-radio h-4 w-4 text-green-600"
                                    />
                                    <span className="ml-2 text-gray-700">Uygun</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${index}`}
                                        value="Uygun Değil"
                                        checked={item.durum === 'Uygun Değil'}
                                        onChange={() => handleDurumChange(index, 'Uygun Değil')}
                                        className="form-radio h-4 w-4 text-red-600"
                                    />
                                    <span className="ml-2 text-gray-700">Uygun Değil</span>
                                </label>
                            </div>
                            {item.durum === 'Uygun Değil' && (
                                <textarea
                                    value={item.not}
                                    onChange={(e) => handleNotChange(index, e.target.value)}
                                    placeholder="Hatanın sebebini not alın..."
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-8 space-x-4">
                    <button
                        onClick={() => setCurrentView('menu')}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleKaydet}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
            {showModal && (
                <MessageModal 
                    message={message} 
                    onClose={() => {
                        setShowModal(false);
                        if (message === 'Denetim başarıyla kaydedildi!') {
                            setCurrentView('menu');
                        }
                    }} 
                />
            )}
        </div>
    );
};

// DenetimListesi Bileşeni
const DenetimListesi = ({ setCurrentView, setSelectedDenetim }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDenetimler = async () => {
            try {
                // Mock IndexedDB servisi kullanılıyor
                const data = await getDenetimler();
                setDenetimler(data);
            } catch (error) {
                console.error("Denetimler alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDenetimler();
    }, []);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="denetim-listesi p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Denetim Listesi</h2>
            {denetimler.length > 0 ? (
                <ul className="space-y-4">
                    {denetimler.map((denetim) => (
                        <li 
                            key={denetim.id} 
                            onClick={() => handleDenetimClick(denetim)}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition duration-200"
                        >
                            <p className="text-lg font-semibold text-gray-800">Denetim ID: {denetim.id}</p>
                            <p className="text-gray-600">Tarih: {new Date(denetim.tarih).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md">Henüz denetim bulunmamaktadır.</p>
            )}
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={() => setCurrentView('menu')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

// DenetimDetayi Bileşeni
const DenetimDetayi = ({ setCurrentView, selectedDenetim }) => {
    // Eğer selectedDenetim prop'u boşsa, yükleniyor veya hata mesajı gösterilir.
    if (!selectedDenetim) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-xl text-gray-700 mb-4">Denetim detayları yüklenemiyor...</p>
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Dashboard'a Geri Dön
                </button>
            </div>
        );
    }

    return (
        <div className="denetim-detayi p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Denetim Detayı</h2>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-inner mb-6">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                    <span className="font-bold text-gray-900">Tarih:</span> {selectedDenetim.tarih ? new Date(selectedDenetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}
                </p>
                <p className="text-lg font-semibold text-gray-700">
                    <span className="font-bold text-gray-900">Konum:</span> {selectedDenetim.konum ? `Lat: ${selectedDenetim.konum.latitude?.toFixed(4)}, Lon: ${selectedDenetim.konum.longitude?.toFixed(4)}` : 'Konum bilgisi yok'}
                </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800">Kontrol Maddeleri</h3>
            
            {/* Kontrol maddeleri listesini gösterir */}
            {selectedDenetim.kontrolListesi && selectedDenetim.kontrolListesi.length > 0 ? (
                <ul className="space-y-4">
                    {selectedDenetim.kontrolListesi.map((madde, index) => (
                        <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">{madde.metin}</h4>
                            <p className="text-gray-600 mb-1">
                                <span className="font-bold">Durum:</span> 
                                <span className={`font-semibold ml-2 ${madde.durum === 'Uygun' ? 'text-green-600' : 'text-red-600'}`}>
                                    {madde.durum}
                                </span>
                            </p>
                            {madde.not && <p className="text-gray-600 mb-1"><span className="font-bold">Not:</span> {madde.not}</p>}
                            {madde.foto && (
                                <div className="mt-4">
                                    <p className="text-gray-600 font-bold mb-2">Kanıt Fotoğrafı:</p>
                                    <img 
                                        src={madde.foto} 
                                        alt="Kanıt Fotoğrafı" 
                                        className="w-full max-w-sm h-auto rounded-lg shadow-md border border-gray-300"
                                        onError={(e) => {
                                            // Resim yüklenemezse placeholder görsel gösterir
                                            e.target.onerror = null;
                                            e.target.src="https://placehold.co/400x300/a3a3a3/ffffff?text=Resim+Bulunamadı";
                                        }}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md">Bu denetim için kontrol maddesi bulunmuyor.</p>
            )}

            <div className="mt-8 flex justify-center space-x-4">
                <button 
                    onClick={() => setCurrentView('denetimListesi')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Denetim Listesine Dön
                </button>
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Dashboard'a Dön
                </button>
            </div>
        </div>
    );
};

// Dashboard Bileşeni
const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => {
    // denetimler state'ini boş bir dizi olarak başlatıyoruz
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            let allDenetimler = [];

            if (navigator.onLine) {
                try {
                    // API çağrısı simüle ediliyor.
                    const response = {
                        data: {
                            data: [
                                {
                                    id: 1,
                                    tarih: new Date().toISOString(),
                                    formData: [{ durum: 'Uygun Değil' }],
                                    kontrolListesi: [{ metin: "Kontrol 1", durum: "Uygun Değil", not: "Hata notu" }]
                                },
                                {
                                    id: 2,
                                    tarih: new Date().toISOString(),
                                    formData: [{ durum: 'Uygun' }],
                                    kontrolListesi: [{ metin: "Kontrol 2", durum: "Uygun" }]
                                }
                            ]
                        }
                    };
                    if (response.data && Array.isArray(response.data.data)) {
                        allDenetimler = response.data.data;
                    } else {
                        console.error('API’den gelen veri beklenildiği gibi değil:', response.data);
                        throw new Error('API verisi beklenildiği gibi değil.');
                    }
                    console.log('Veriler sunucudan çekildi.');
                } catch (apiError) {
                    console.error('API’den veri çekilirken hata oluştu, IndexedDB’den çekiliyor:', apiError);
                    try {
                        allDenetimler = await getDenetimler();
                        setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                    } catch (dbError) {
                        setError('Hata: Veriler yerel depodan da alınamadı. Lütfen daha sonra tekrar deneyin.');
                        console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                    }
                }
            } else {
                try {
                    allDenetimler = await getDenetimler();
                    setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                } catch (dbError) {
                    setError('Hata: Çevrimdışı modda veriler yerel depodan alınamadı. Lütfen daha sonra tekrar deneyin.');
                    console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                }
            }

            if (Array.isArray(allDenetimler)) {
                setDenetimler(allDenetimler);
            } else {
                setDenetimler([]);
            }

            setLoading(false);
            if(modalMessage) setShowModal(true);
        };

        fetchDashboardData();
    }, [refreshTrigger, modalMessage]);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) return <div>Veriler yükleniyor...</div>;
    if (error) return <div>Hata: {error}</div>;

    const hatalıDenetimler = denetimler.filter(d => d.formData && d.formData.some(m => m.durum === 'Uygun Değil'));

    return (
        <div className="dashboard-container">
            <h2>Genel Denetim Özeti</h2>
            <p>Toplam Yapılan Denetim Sayısı: <strong>{denetimler.length}</strong></p>

            <h3>Hatalı Denetimler</h3>
            {hatalıDenetimler.length > 0 ? (
                <ol>
                    {hatalıDenetimler.map((denetim, index) => (
                        <li key={denetim._id || denetim.id} onClick={() => handleDenetimClick(denetim)}>
                            ({index + 1}) Tarih: {denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Harika! Henüz hatalı denetim bulunmuyor.</p>
            )}

            <div className="form-action-buttons">
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};


// Ana Uygulama Bileşeni
export default function App() {
    const [currentView, setCurrentView] = useState('menu');
    const [selectedDenetim, setSelectedDenetim] = useState(null);
    const refreshTrigger = useState(0);

    const renderView = () => {
        switch (currentView) {
            case 'menu':
                return <Menu setCurrentView={setCurrentView} />;
            case 'denetimFormu':
                return <DenetimFormu setCurrentView={setCurrentView} />;
            case 'denetimListesi':
                return <DenetimListesi setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} />;
            case 'dashboard':
                return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} refreshTrigger={refreshTrigger} />;
            case 'denetimDetayi':
                // Pass selectedDenetim to the detail view
                return <DenetimDetayi setCurrentView={setCurrentView} selectedDenetim={selectedDenetim} />;
            default:
                return <Menu setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">
            <script src="https://cdn.tailwindcss.com"></script>
            {renderView()}
        </div>
    );
}
