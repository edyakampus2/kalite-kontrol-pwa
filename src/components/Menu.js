// src/components/Menu.js
// Uygulamanın ana menü butonlarını içeren bileşen.
// `navigateTo` prop'u aracılığıyla sayfa yönlendirme işlevini kullanır.

import React from 'react';

const Menu = ({ navigateTo }) => {
    return (
        <div className="menu p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Kalite Kontrol PWA</h1>
            <h2 className="text-2xl font-semibold mb-8 text-gray-700">Ana Menü</h2>
            <div className="space-y-4 w-full max-w-sm">
                {/* Yeni Denetim Başlat butonu, DenetimFormu sayfasına yönlendirir */}
                <button
                    onClick={() => navigateTo('form')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                    Yeni Denetim Başlat
                </button>
                {/* Denetimlerim butonu, DenetimListesi sayfasına yönlendirir */}
                <button
                    onClick={() => navigateTo('list')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                    Denetimlerim
                </button>
                {/* Dashboard butonu, Dashboard sayfasına yönlendirir */}
                <button
                    onClick={() => navigateTo('dashboard')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                    Dashboard
                </button>
                {/* Yedekleme butonu, Yedekleme sayfasına yönlendirir */}
                <button
                    onClick={() => navigateTo('yedekleme')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                    Yedekleme ve Geri Yükleme
                </button>
            </div>
        </div>
    );
};

export default Menu;
