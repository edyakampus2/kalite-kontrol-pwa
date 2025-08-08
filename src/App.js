// Tarih: 08.08.2025 Saat: 11:45
// src/App.js

import React, { useState } from 'react';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard'; // Dashboard bileşeni doğru şekilde içe aktarılıyor.
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');

  const renderView = () => {
    switch (currentView) {
      case 'form':
        return <DenetimFormu setCurrentView={setCurrentView} />;
      case 'list':
        return <DenetimListesi setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />; // Dashboard bileşeni artık burada kullanılıyor
      default:
        return <Menu setCurrentView={setCurrentView} />;
    }
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
