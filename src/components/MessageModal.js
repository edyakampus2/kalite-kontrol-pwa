// src/components/MessageModal.js
// Tarih: 08.08.2025 Saat: 15:30
// Açıklama: Uygulama içinde kullanıcıya bilgilendirme mesajları göstermek için kullanılan modal bileşeni.

import React from 'react';

const MessageModal = ({ show, message, onClose }) => {
    // show prop'u false ise modalı render etme
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center max-w-sm w-full animate-fade-in-up">
                <p className="text-gray-800 text-lg mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Tamam
                </button>
            </div>
        </div>
    );
};

export default MessageModal;
