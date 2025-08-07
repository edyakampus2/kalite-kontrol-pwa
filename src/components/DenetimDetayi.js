// src/components/DenetimDetayi.js

import React from 'react';

// Denetim detaylarını gösteren bileşen
const DenetimDetayi = ({ setCurrentView, selectedDenetim }) => {
    // selectedDenetim prop'u yoksa veya undefined ise, erken çıkış yap
    if (!selectedDenetim) {
        return (
            <div className="denetim-detayi-container p-6 bg-gray-100 min-h-screen">
                <p className="text-center text-gray-700">Denetim detayları yükleniyor veya bulunamadı...</p>
                <div className="form-action-buttons mt-4 flex justify-center">
                    <button
                        onClick={() => setCurrentView('list')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Denetim Listesine Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="denetim-detayi-container p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Denetim Detayı</h2>
            <p className="mb-2 text-gray-600"><strong>Tarih:</strong> {new Date(selectedDenetim.tarih).toLocaleString()}</p>
            <p className="mb-4 text-gray-600"><strong>Denetim ID:</strong> {selectedDenetim.id}</p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Denetim Maddeleri</h3>
            <ul className="space-y-4">
                {selectedDenetim.formData && selectedDenetim.formData.map((madde, index) => (
                    <li key={index} className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="font-medium">{madde.metin}</p>
                        <p className={`font-bold ${madde.durum === 'Uygun' ? 'text-green-600' : 'text-red-600'}`}>
                            Durum: {madde.durum}
                        </p>
                        {madde.not && <p className="text-gray-600">Not: {madde.not}</p>}
                        {madde.foto && (
                            <div className="mt-2">
                                <img src={madde.foto} alt="Denetim Fotoğrafı" className="max-w-full h-auto rounded-lg shadow-md" />
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div className="form-action-buttons mt-8">
                <button
                    onClick={() => setCurrentView('list')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Denetim Listesine Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimDetayi;
