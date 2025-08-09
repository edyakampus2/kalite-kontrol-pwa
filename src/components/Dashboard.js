// src/components/Dashboard.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Denetim verilerinin özetini ve istatistiklerini gösterir.
// Hatalı denetimlerin sayısını ve listesini sunar.

import React from 'react';

const Dashboard = ({ setCurrentView, denetimler }) => {
    // Toplam denetim sayısı
    const totalDenetimSayisi = denetimler.length;

    // Hatalı denetimleri bulan fonksiyon
    const hatalar = denetimler.filter(denetim =>
        denetim.kontrolListesi.some(madde => madde.durum === 'Uygun Değil')
    );
    const hataliDenetimSayisi = hatalar.length;

    return (
        <div className="dashboard p-6 bg-gray-100 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <p className="text-sm text-gray-500">Toplam Denetim Sayısı</p>
                    <p className="text-4xl font-bold text-blue-600">{totalDenetimSayisi}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <p className="text-sm text-gray-500">Hatalı Denetim Sayısı</p>
                    <p className="text-4xl font-bold text-red-600">{hataliDenetimSayisi}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Son Hatalı Denetimler</h3>
                {hatalar.length > 0 ? (
                    <ul className="space-y-2">
                        {hatalar.slice(0, 5).map(denetim => (
                            <li key={denetim.id} className="border-b pb-2 last:border-b-0">
                                <p className="font-medium text-gray-700">
                                    <span className="text-gray-500 italic text-sm mr-2">Tarih:</span>
                                    {new Date(denetim.tarih).toLocaleDateString('tr-TR')}
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                    Hata: {denetim.kontrolListesi.find(m => m.durum === 'Uygun Değil')?.madde}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 italic">Son zamanlarda hatalı denetim bulunmuyor.</p>
                )}
            </div>
            
            <button
                onClick={() => setCurrentView('menu')}
                className="mt-6 w-full py-3 px-6 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
            >
                Ana Menüye Dön
            </button>
        </div>
    );
};

export default Dashboard;
