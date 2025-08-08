// Tarih: 08.08.2025 Saat: 12:00
// src/components/Menu.js

import React from 'react';

const Menu = ({ setCurrentView }) => {
  return (
    // Tailwind CSS sınıfları ile menü container'ı ortalanıyor ve dikey boşluklar ayarlanıyor.
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-100 rounded-lg shadow-xl m-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Ana Menü</h2>
      {/* Her bir butona modern bir görünüm için Tailwind CSS sınıfları eklendi. */}
      <button 
        onClick={() => setCurrentView('form')}
        className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 w-64 transform hover:scale-105"
      >
        Yeni Denetim Başlat
      </button>
      <button 
        onClick={() => setCurrentView('list')}
        className="px-8 py-4 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 w-64 transform hover:scale-105"
      >
        Denetimlerim
      </button>
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="px-8 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300 w-64 transform hover:scale-105"
      >
        Dashboard
      </button>
    </div>
  );
};

export default Menu;
