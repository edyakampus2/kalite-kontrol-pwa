// src/components/Menu.js
// Tarih: 09.08.2025 Saat: 14:26
// Açıklama: Uygulamanın ana menü bileşeni. Kullanıcıya ana yönlendirme seçeneklerini sunar.
// Yenilikler: Butonlar ortalanmıştır, yüksekliği artırılmış ve aralarına boşluk eklenmiştir.
import React from 'react';

const Menu = ({ setCurrentView }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Ana Menü</h2>
            <p className="text-gray-600 mb-6 text-center">Lütfen yapmak istediğiniz işlemi seçin.</p>
            <button
                onClick={() => setCurrentView('denetimFormu')}
                className="w-full max-w-xs py-4 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
                Yeni Denetim Yap
            </button>
            <button
                onClick={() => setCurrentView('denetimListesi')}
                className="w-full max-w-xs py-4 px-6 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
                Denetim Listesi
            </button>
            <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full max-w-xs py-4 px-6 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
                Dashboard
            </button>
        </div>
    );
};

export default Menu;
