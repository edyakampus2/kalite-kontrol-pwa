// src/components/DenetimDetayi.js
// Tarih: 08.08.2025 Saat: 15:10
// Açıklama: Seçilen bir denetimin detaylarını gösterir ve kullanıcıya Ana Menüye veya Dashboard'a geri dönme imkanı sunar.

import React, { useEffect } from 'react';

const DenetimDetayi = ({ setCurrentView, selectedDenetim }) => {
    // Sayfa yüklendiğinde, eğer selectedDenetim yoksa kullanıcıyı güvenli bir sayfaya yönlendirir
    useEffect(() => {
        if (!selectedDenetim) {
            setCurrentView('dashboard');
        }
    }, [selectedDenetim, setCurrentView]);

    // Eğer selectedDenetim hala yoksa, yükleniyor veya hata mesajı gösterilebilir.
    if (!selectedDenetim) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-xl text-gray-700 mb-4">Denetim detayları yüklenemiyor...</p>
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Geri Dön
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

export default DenetimDetayi;
