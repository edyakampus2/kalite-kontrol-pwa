// Tarih: 08.08.2025 Saat: 11:30
// src/App.js

import React, { useState } from 'react';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Dashboard from './components/Dashboard'; // Yeni eklenen Özet bileşeni
import Menu from './components/Menu'; // Yeni eklenen Menu bileşeni
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');

  const renderView = () => {
    if (currentView === 'form') {
      return <DenetimFormu setCurrentView={setCurrentView} />;
    }
    if (currentView === 'list') {
      return <DenetimListesi setCurrentView={setCurrentView} />;
    }
    // Artık menüyü ayrı bir bileşen olarak render ediyoruz
    return <Menu setCurrentView={setCurrentView} />;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kalite Kontrol PWA</h1>
      </header>
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
