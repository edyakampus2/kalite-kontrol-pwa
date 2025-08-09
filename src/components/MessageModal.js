// src/components/MessageModal.js
// Tarih: 09.08.2025 Saat: 14:25
// Açıklama: Uygulama genelinde kullanılacak, özelleştirilebilir bir mesaj modalı bileşeni.
// isOpen: Modal'ın görünürlüğünü kontrol eder.
// message: Modal içinde gösterilecek metin.
// onClose: Modal'ı kapatmak için çağrılacak fonksiyon.

import React from 'react';

const MessageModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-transform duration-300 ease-in-out scale-100">
                <p className="text-xl font-semibold text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                >
                    Tamam
                </button>
            </div>
        </div>
    );
};

export default MessageModal;
