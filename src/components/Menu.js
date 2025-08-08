// Tarih: 08.08.2025 Saat: 13:20
// src/components/Menu.js

import React from 'react';

const Menu = ({ setCurrentView }) => {
  return (
    <div className="menu">
      <h2>Ana Menü</h2>
      <button onClick={() => setCurrentView('form')}>Yeni Denetim Başlat</button>
      <button onClick={() => setCurrentView('list')}>Denetimlerim</button>
      <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
      <button onClick={() => setCurrentView('yedekleme')}>Yedekleme ve Geri Yükleme</button>
    </div>
  );
};

export default Menu;