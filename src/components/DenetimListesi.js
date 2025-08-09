// src/components/DenetimListesi.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Kaydedilmiş denetimlerin listesini gösterir.
// Kullanıcı, bir denetimi seçerek detay ekranına geçebilir.

import React from 'react';

const DenetimListesi = ({ setCurrentView, setSelectedDenetim, denetimler }) => {
    const handleDenetimSelect = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    return (
        <div className="denetim-listesi p-6 bg-gray-100 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Denetim Listesi</h2>
            {denetimler.length > 0 ? (
                <div className="space-y-4">
                    {denetimler.map(denetim => (
                        <div
                            key={denetim.id}
                            onClick={() => handleDenetimSelect(denetim)}
                            className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out flex justify-between items-center"
                        >
                            <span className="font-semibold text-gray-700">
                                {new Date(denetim.tarih).toLocaleString('tr-TR')}
                            </span>
                            <span className="text-sm text-gray-500">
                                Kayıt ID: {denetim.id.substring(0, 8)}...
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic">Henüz kaydedilmiş denetim yok.</p>
            )}
            <button
                onClick={() => setCurrentView('menu')}
                className="mt-6 w-full py-3 px-6 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
            >
                Ana Menüye Dön
            </button>
        </div>
    );
};

export default DenetimListesi;
