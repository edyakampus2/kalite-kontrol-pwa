// src/App.js

import React, { useState } from 'react';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
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
    return (
      <div className="menu">
        <h2>Ana Menü</h2>
        <button onClick={() => setCurrentView('form')}>Yeni Denetim Başlat</button>
        <button onClick={() => setCurrentView('list')}>Denetimlerim</button>
      </div>
    );
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
