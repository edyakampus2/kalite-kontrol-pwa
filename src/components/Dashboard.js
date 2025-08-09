// src/components/Dashboard.js
// Tarih: 09.08.2025 Saat: 14:40
// Açıklama: Denetim istatistiklerini gösteren bileşen.
// Yenilikler: Denetim verilerini App.js'den prop olarak alır.
import React from 'react';

const Dashboard = ({ setCurrentView, denetimler }) => {
    // Toplam denetim sayısı
    const toplamDenetimSayisi = denetimler.length;

    // Hatalı denetimleri bulma
    const hataliDenetimler = denetimler
        .flatMap(denetim =>
            denetim.maddeler
                .filter(madde => madde.secim === 'Uygun Değil')
                .map(madde => ({
                    denetimId: denetim.id,
                    tarih: denetim.tarih,
                    madde: madde.baslik,
                    not: madde.not,
                }))
        )
        .sort((a, b) => new Date(b.tarih) - new Date(a.tarih)); // Tarihe göre sırala

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-blue-800">Toplam Denetim Sayısı</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{toplamDenetimSayisi}</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-red-800">Toplam Hatalı Madde Sayısı</p>
                    <p className="text-4xl font-bold text-red-600 mt-2">{hataliDenetimler.length}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Son Hatalı Denetimler</h3>
                {hataliDenetimler.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {hataliDenetimler.map((item, index) => (
                            <li key={index} className="py-4">
                                <p className="font-semibold text-gray-700">
                                    <span className="text-red-500">Hatalı Madde:</span> {item.madde}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Denetim Tarihi:</span> {item.tarih}
                                </p>
                                {item.not && (
                                    <p className="text-sm text-gray-500 italic">
                                        <span className="font-medium">Not:</span> {item.not}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Tüm denetimler başarıyla tamamlanmıştır.</p>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={() => setCurrentView('menu')}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
