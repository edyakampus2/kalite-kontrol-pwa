// Tarih: 2025-08-08
// Kod Grup Açıklaması: Denetim Listesi Bileşeni
import React, { useState, useEffect } from 'react';
import { getDenetimler } from '../services/IndexedDBService';

const DenetimListesi = ({ setCurrentView, setSelectedDenetim }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDenetimler = async () => {
            try {
                const data = await getDenetimler();
                setDenetimler(data);
            } catch (error) {
                console.error("Denetimler alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDenetimler();
    }, []);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="denetim-listesi p-4 sm:p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Denetim Listesi</h2>
            {denetimler.length > 0 ? (
                <ul className="space-y-4">
                    {denetimler.map((denetim) => (
                        <li 
                            key={denetim.id} 
                            onClick={() => handleDenetimClick(denetim)}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition duration-200"
                        >
                            <p className="text-lg font-semibold text-gray-800">Denetim ID: {denetim.id}</p>
                            <p className="text-gray-600">Tarih: {new Date(denetim.tarih).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md">Henüz denetim bulunmamaktadır.</p>
            )}
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={() => setCurrentView('menu')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default DenetimListesi;
