// src/App.js
// Tarih: 09.08.2025 Saat: 14:25
// Açıklama: Uygulamanın ana bileşeni. Ekranlar arası geçişi, global state'leri yönetir ve yeni MessageModal bileşenini kullanır.

import React, { useState, useEffect, useCallback } from 'react';
import Menu from './components/Menu';
import DenetimFormu from './components/DenetimFormu';
import DenetimListesi from './components/DenetimListesi';
import DenetimDetayi from './components/DenetimDetayi';
import Dashboard from './components/Dashboard';
import MessageModal from './components/MessageModal'; // Yeni modal bileşenini import ediyoruz
import { getDenetimler } from './services/IndexedDBService';

// Tailwind CSS importu
import './index.css';

const App = () => {
    const [currentView, setCurrentView] = useState('menu');
    const [denetimler, setDenetimler] = useState([]);
    const [selectedDenetim, setSelectedDenetim] = useState(null);

    // Modal state'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchDenetimler = useCallback(async () => {
        try {
            const allDenetimler = await getDenetimler();
            setDenetimler(allDenetimler);
        } catch (error) {
            console.error("Denetimler çekilirken hata oluştu:", error);
        }
    }, []);

    useEffect(() => {
        fetchDenetimler();
    }, [fetchDenetimler]);

    const handleShowModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
        setCurrentView('menu');
        fetchDenetimler();
    };

    const renderView = () => {
        switch (currentView) {
            case 'denetimFormu':
                return (
                    <DenetimFormu
                        setCurrentView={setCurrentView}
                        handleShowModal={handleShowModal}
                        handleCloseModal={handleCloseModal}
                    />
                );
            case 'denetimListesi':
                return (
                    <DenetimListesi
                        setCurrentView={setCurrentView}
                        setSelectedDenetim={setSelectedDenetim}
                        denetimler={denetimler}
                    />
                );
            case 'denetimDetayi':
                return (
                    <DenetimDetayi
                        setCurrentView={setCurrentView}
                        denetim={selectedDenetim}
                    />
                );
            case 'dashboard':
                return (
                    <Dashboard
                        setCurrentView={setCurrentView}
                        denetimler={denetimler}
                    />
                );
            default:
                return <Menu setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased text-gray-800 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">Kalite Kontrol Uygulaması</h1>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden p-6">
                {renderView()}
            </div>

            {/* Yeni MessageModal bileşenini kullanıyoruz */}
            <MessageModal
                isOpen={isModalOpen}
                message={modalMessage}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default App;
