// src/components/DenetimDetayi.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Seçilen bir denetimin tüm detaylarını gösteren bileşen.

import React from 'react';

const DenetimDetayi = ({ setCurrentView, denetim }) => {
    if (!denetim) {
        return (
            <div className="denetim-detayi p-6 bg-gray-100 rounded-xl shadow-inner text-center">
                <p className="text-xl font-semibold text-gray-700">Denetim bulunamadı.</p>
                <button
                    onClick={() => setCurrentView('denetimListesi')}
                    className="mt-6 w-full py-3 px-6 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
                >
                    Listeye Dön
                </button>
            </div>
        );
    }

    return (
        <div className="denetim-detayi p-6 bg-gray-100 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Denetim Detayı</h2>
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Tarih:</p>
                    <p className="font-semibold text-gray-700">
                        {new Date(denetim.tarih).toLocaleString('tr-TR')}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Konum:</p>
                    <p className="font-semibold text-gray-700">
                        {denetim.konum ? `Enlem: ${denetim.konum.latitude.toFixed(4)}, Boylam: ${denetim.konum.longitude.toFixed(4)}` : 'Konum bilgisi yok'}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500 mb-2">Kontrol Listesi:</p>
                    <ul className="space-y-2">
                        {denetim.kontrolListesi.map((madde, index) => (
                            <li key={index} className="border-b last:border-b-0 pb-2">
                                <p className="font-medium text-gray-700">{madde.madde}: <span className={`font-bold ${madde.durum === 'Uygun' ? 'text-green-600' : 'text-red-600'}`}>{madde.durum}</span></p>
                                {madde.durum === 'Uygun Değil' && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        {madde.not && <p className="text-sm text-gray-600 italic">Not: {madde.not}</p>}
                                        {madde.foto && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Fotoğraf:</span>
                                                <img
                                                    src={`data:image/jpeg;base64,${madde.foto}`}
                                                    alt="Kanıt"
                                                    className="w-32 h-32 object-cover rounded-md shadow-inner"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button
                onClick={() => setCurrentView('denetimListesi')}
                className="mt-6 w-full py-3 px-6 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
            >
                Listeye Dön
            </button>
        </div>
    );
};

export default DenetimDetayi;
