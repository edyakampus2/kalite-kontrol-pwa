import React from 'react';

// Ana menü bileşeni, Tailwind CSS ile stillendirildi
const Menu = ({ setCurrentView }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-center">Kalite Kontrol PWA</h1>
            <h2 className="text-2xl font-bold mb-10 text-gray-300">Ana Menü</h2>
            <div className="flex flex-col space-y-6 w-full max-w-sm">
                <button
                    onClick={() => setCurrentView('form')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    Yeni Denetim Başlat
                </button>
                <button
                    onClick={() => setCurrentView('list')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    Denetimlerim
                </button>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
};

export default Menu;
