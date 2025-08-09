// Tarih: 2025-08-08
// Kod Grup Açıklaması: Ana Menü Bileşeni
import React from 'react';

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

export default Menu;
