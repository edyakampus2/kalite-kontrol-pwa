import React from 'react';
import MessageModal from './MessageModal';

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