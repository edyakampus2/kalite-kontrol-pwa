// src/components/DenetimListesi.js
// Tarih: 09.08.2025 Saat: 14:45
// Açıklama: Tüm denetimleri listeleyen bileşen.
// Bu versiyon verileri App.js'den prop olarak alır.
import React from 'react';

const DenetimListesi = ({ setCurrentView, setSelectedDenetim, denetimler }) => {
    const handleDenetimSecimi = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Denetim Listesi</h2>
            {denetimler.length > 0 ? (
                denetimler.map(denetim => (
                    <div
                        key={denetim.id}
                        onClick={() => handleDenetimSecimi(denetim)}
                        className="bg-white p-4 mb-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <p className="font-semibold text-lg text-gray-700">Denetim ID: {denetim.id}</p>
                        <p className="text-sm text-gray-500">Tarih: {denetim.tarih}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Henüz kaydedilmiş denetim bulunmamaktadır.</p>
            )}
            <div className="mt-6">
                <button
                    onClick={() => setCurrentView('menu')}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimListesi;
