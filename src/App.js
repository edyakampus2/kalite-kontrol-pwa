// src/App.js
// Tarih: 09.08.2025 Saat: 14:40
// Açıklama: Uygulamanın ana bileşeni ve durum yöneticisi.
// Yenilikler: Denetim verileri artık App.js'de merkezi olarak yönetiliyor ve alt bileşenlere prop olarak iletiliyor.
import React, { useState } from 'react';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import DenetimDetayi from './components/DenetimDetayi';
import Dashboard from './components/Dashboard';

// Mock veriler başlangıçta yüklenebilir
const denetimlerMock = [
    {
        id: 1,
        tarih: '01.08.2025',
        maddeler: [
            { id: 1, baslik: 'Üretim bandı temizliği', secim: 'Uygun' },
            { id: 2, baslik: 'Son ürün kalite kontrolü', secim: 'Uygun Değil', not: 'Kutu hasarlı.' },
            { id: 3, baslik: 'Çalışan ekipmanların durumu', secim: 'Uygun' },
            { id: 4, baslik: 'İş sağlığı ve güvenliği kuralları', secim: 'Uygun' },
        ],
    },
    {
        id: 2,
        tarih: '05.08.2025',
        maddeler: [
            { id: 1, baslik: 'Üretim bandı temizliği', secim: 'Uygun' },
            { id: 2, baslik: 'Son ürün kalite kontrolü', secim: 'Uygun' },
            { id: 3, baslik: 'Çalışan ekipmanların durumu', secim: 'Uygun Değil', not: 'Makinede yağ sızıntısı var.' },
            { id: 4, baslik: 'İş sağlığı ve güvenliği kuralları', secim: 'Uygun' },
        ],
    },
];

const App = () => {
    // Mevcut görünümü yöneten state
    const [currentView, setCurrentView] = useState('menu');
    // Seçili denetimi yöneten state
    const [selectedDenetim, setSelectedDenetim] = useState(null);
    // Tüm denetim verilerini yöneten state
    const [denetimler, setDenetimler] = useState(denetimlerMock);

    // Yeni bir denetim ekleme fonksiyonu
    const addDenetim = (yeniDenetim) => {
        setDenetimler(prevDenetimler => [...prevDenetimler, yeniDenetim]);
    };

    const renderView = () => {
        switch (currentView) {
            case 'menu':
                return <Menu setCurrentView={setCurrentView} />;
            case 'denetimFormu':
                return <DenetimFormu setCurrentView={setCurrentView} addDenetim={addDenetim} />;
            case 'denetimListesi':
                return <DenetimListesi setCurrentView={setCurrentView} setSelectedDenetim={setSelectedDenetim} denetimler={denetimler} />;
            case 'denetimDetayi':
                return <DenetimDetayi setCurrentView={setCurrentView} denetim={selectedDenetim} />;
            case 'dashboard':
                return <Dashboard setCurrentView={setCurrentView} denetimler={denetimler} />;
            default:
                return <Menu setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {renderView()}
        </div>
    );
};

export default App;
