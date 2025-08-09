// Tarih: 2025-08-08
// Kod Grup Açıklaması: Ana Uygulama Yapısı
import React, { useState } from 'react';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import DenetimDetayi from './components/DenetimDetayi';
import Dashboard from './components/Dashboard';

export default function App() {
    const [currentView, setCurrentView] = useState('menu');
    const [selectedDenetim, setSelectedDenetim] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const renderView = () => {
        switch (currentView) {
            case 'menu':
                return <Menu setCurrentView={setCurrentView} />;
            case 'denetimFormu':
                return <DenetimFormu setCurrentView={setCurrentView} />;
            case 'denetimListesi':
                return <DenetimListesi setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} />;
            case 'dashboard':
                return <Dashboard setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} refreshTrigger={refreshTrigger} />;
            case 'denetimDetayi':
                return <DenetimDetayi setCurrentView={setCurrentView} selectedDenetim={selectedDenetim} />;
            default:
                return <Menu setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">
            <script src="https://cdn.tailwindcss.com"></script>
            {renderView()}
        </div>
    );
}
