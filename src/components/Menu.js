// src/components/Menu.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Uygulamanın ana menü bileşeni. Kullanıcıya ana ekranlara geçiş seçenekleri sunar.

import React from 'react';

const Menu = ({ setCurrentView }) => {
    return (
        <div className="menu space-y-6 p-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Ana Menü</h2>
            <p className="text-center text-gray-600">Lütfen yapmak istediğiniz işlemi seçin.</p>
            <div className="grid gap-4 mt-6">
                <button
                    onClick={() => setCurrentView('denetimFormu')}
                    className="w-full py-4 px-6 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                    Yeni Denetim Yap
                </button>
                <button
                    onClick={() => setCurrentView('denetimListesi')}
                    className="w-full py-4 px-6 bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                    Denetim Listesi
                </button>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full py-4 px-6 bg-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-purple-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
};

export default Menu;
