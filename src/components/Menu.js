// Tarih: 2025-08-09 Saat: 17:50
// Kod Grup Açıklaması: Menu bileşeninden kullanılmayan MessageModal importunun kaldırılması.
import React from 'react';

const Menu = ({ setCurrentView }) => {
    return (
        <div className="menu">
            <h1>Kalite Kontrol PWA</h1>
            <p>Hoşgeldiniz!</p>
            <nav>
                <button onClick={() => setCurrentView('form')}>Yeni Denetim Başlat</button>
                <button onClick={() => setCurrentView('list')}>Denetimleri Görüntüle</button>
                <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
                <button onClick={() => setCurrentView('yedekleme')}>Yedekleme ve Geri Yükleme</button>
            </nav>
        </div>
    );
};

export default Menu;