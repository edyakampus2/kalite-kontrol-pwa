// Tarih: 2025-08-08
// Kod Grup Açıklaması: Mesaj Kutusu Modalı
import React from 'react';

const MessageModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto text-center">
                <p className="text-gray-800 text-lg mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Tamam
                </button>
            </div>
        </div>
    );
};

export default MessageModal;
