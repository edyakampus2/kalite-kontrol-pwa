import React from 'react';

// Ana menü bileşeni
const Menu = ({ setCurrentView }) => {
    return (
        <div className="menu-container p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Kalite Kontrol PWA</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-10">Ana Menü</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => setCurrentView('form')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Yeni Denetim Başlat
                </button>
                <button
                    onClick={() => setCurrentView('list')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Denetimlerim
                </button>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
};

export default Menu;
