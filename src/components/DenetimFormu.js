// src/components/DenetimFormu.js
// Tarih: 09.08.2025 Saat: 14:35
// Açıklama: Yeni bir denetim formu oluşturma bileşeni.
// Yenilikler: Eksik bırakılan maddelerin başlıkları kırmızı renkte gösterilir.
import React, { useState } from 'react';

// Denetim maddelerini tutan sahte veri
const denetimMaddeleriMock = [
    { id: 1, baslik: 'Üretim bandı temizliği' },
    { id: 2, baslik: 'Son ürün kalite kontrolü' },
    { id: 3, baslik: 'Çalışan ekipmanların durumu' },
    { id: 4, baslik: 'İş sağlığı ve güvenliği kuralları' },
];

const DenetimFormu = ({ setCurrentView, addDenetim }) => {
    // Denetim maddelerini ve seçimlerini tutmak için state
    const [denetimMaddeleri, setDenetimMaddeleri] = useState(
        denetimMaddeleriMock.map(madde => ({ ...madde, secim: null, not: '' }))
    );
    // Modal penceresinin görünürlüğünü yöneten state
    const [showModal, setShowModal] = useState(false);
    // Geçersiz (boş bırakılan) maddelerin ID'lerini tutan state
    const [invalidMaddeler, setInvalidMaddeler] = useState([]);

    // Seçim değişikliğini yöneten fonksiyon
    const handleSecimDegisikligi = (maddeId, secim) => {
        setDenetimMaddeleri(prevMaddeler =>
            prevMaddeler.map(madde =>
                madde.id === maddeId ? { ...madde, secim } : madde
            )
        );
        // Seçim yapıldığında ilgili maddeyi geçersiz listesinden çıkar
        setInvalidMaddeler(prevInvalid => prevInvalid.filter(id => id !== maddeId));
    };

    // Not değişikliğini yöneten fonksiyon
    const handleNotDegisikligi = (maddeId, not) => {
        setDenetimMaddeleri(prevMaddeler =>
            prevMaddeler.map(madde =>
                madde.id === maddeId ? { ...madde, not } : madde
            )
        );
    };

    // Denetimi kaydetme fonksiyonu
    const handleDenetimiKaydet = () => {
        const eksikMaddeler = denetimMaddeleri.filter(madde => madde.secim === null);
        const eksikSecimVarMi = eksikMaddeler.length > 0;

        if (eksikSecimVarMi) {
            // Eksik seçim varsa modalı göster ve geçersiz maddeleri belirle
            setShowModal(true);
            setInvalidMaddeler(eksikMaddeler.map(madde => madde.id));
            return; // Fonksiyonu durdur
        }

        const yeniDenetim = {
            id: Date.now(), // Basit bir ID
            tarih: new Date().toLocaleDateString('tr-TR'),
            maddeler: denetimMaddeleri,
        };

        addDenetim(yeniDenetim);
        setCurrentView('denetimListesi'); // Listeye dön
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Denetim Oluştur</h2>

            {denetimMaddeleri.map(madde => (
                <div key={madde.id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
                    {/* Madde başlığı, geçersizse kırmızı renkte göster */}
                    <p className={`font-semibold ${invalidMaddeler.includes(madde.id) ? 'text-red-600' : 'text-gray-700'}`}>
                        {madde.baslik}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        {/* Uygun seçeneği */}
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name={`secim-${madde.id}`}
                                value="Uygun"
                                checked={madde.secim === 'Uygun'}
                                onChange={() => handleSecimDegisikligi(madde.id, 'Uygun')}
                                className="form-radio text-green-500 h-5 w-5"
                            />
                            <span className="ml-2 text-green-600">Uygun</span>
                        </label>
                        
                        {/* Uygun Değil seçeneği */}
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name={`secim-${madde.id}`}
                                value="Uygun Değil"
                                checked={madde.secim === 'Uygun Değil'}
                                onChange={() => handleSecimDegisikligi(madde.id, 'Uygun Değil')}
                                className="form-radio text-red-500 h-5 w-5"
                            />
                            <span className="ml-2 text-red-600">Uygun Değil</span>
                        </label>
                    </div>
                    {/* "Uygun Değil" seçeneği için not alanı */}
                    {madde.secim === 'Uygun Değil' && (
                        <textarea
                            value={madde.not}
                            onChange={(e) => handleNotDegisikligi(madde.id, e.target.value)}
                            placeholder="Notunuzu buraya yazın..."
                            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                        ></textarea>
                    )}
                </div>
            ))}

            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setCurrentView('menu')}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Ana Menüye Dön
                </button>
                <button
                    onClick={handleDenetimiKaydet}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Denetime Kaydet
                </button>
            </div>

            {/* Uyarı Modalı */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.5-1.687 1.732-3.093L13.732 4.907c-.77-1.41-2.694-1.41-3.464 0L3.332 15.907c-.768 1.406.19 3.093 1.732 3.093z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-red-600">Eksik Seçim</h3>
                        <div className="mt-2 px-7 py-3">
                            <p className="text-sm text-gray-500">
                                Lütfen tüm maddeler için seçim yapın. Eksik maddeler kırmızı renkte belirtilmiştir.
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DenetimFormu;
