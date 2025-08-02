// src/App.js

import React, { useState } from 'react';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import Dashboard from './components/Dashboard';
import DenetimDetayi from './components/DenetimDetayi'; // Yeni eklenen satır
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedDenetim, setSelectedDenetim] = useState(null); // Yeni state

  const renderView = () => {
    if (currentView === 'form') {
      return <DenetimFormu setCurrentView={setCurrentView} />;
    }
    if (currentView === 'list') {
      return <DenetimListesi setCurrentView={setCurrentView} />;
    }
    if (currentView === 'dashboard') {
      return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} />;
    }
    if (currentView === 'denetimDetayi') { // Yeni eklenen if bloğu
      return <DenetimDetayi selectedDenetim={selectedDenetim} setCurrentView={setCurrentView} />;
    }
    return (
      <div className="menu">
        <h2>Ana Menü</h2>
        <button onClick={() => setCurrentView('form')}>Yeni Denetim Başlat</button>
        <button onClick={() => setCurrentView('list')}>Denetimlerim</button>
        <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
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