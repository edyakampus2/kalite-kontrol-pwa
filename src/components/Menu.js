// Tarih: 08.08.2025 Saat: 12:15
// src/components/Menu.js

import React from 'react';

const Menu = ({ setCurrentView }) => {
  return (
    // Tailwind CSS sınıfları ile koyu gri arka plan, ortalanmış içerik ve dikey boşluklar
    <div className="flex flex-col items-center justify-center space-y-6 p-10 bg-gray-800 rounded-lg shadow-2xl m-4">
      <h2 className="text-4xl font-extrabold text-white mb-6">Ana Menü</h2>
      {/* Daha büyük ve daha canlı renklere sahip butonlar */}
      <button 
        onClick={() => setCurrentView('form')}
        className="px-10 py-5 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 w-80 transform hover:scale-105"
      >
        Yeni Denetim Başlat
      </button>
      <button 
        onClick={() => setCurrentView('list')}
        className="px-10 py-5 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 w-80 transform hover:scale-105"
      >
        Denetimlerim
      </button>
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="px-10 py-5 bg-amber-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300 w-80 transform hover:scale-105"
      >
        Dashboard
      </button>
    </div>
  );
};

export default Menu;
