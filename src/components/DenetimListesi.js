// src/components/DenetimListesi.js

import React, { useState, useEffect } from 'react';
import { getDenetimler } from '../services/IndexedDBService';

const DenetimListesi = ({ setCurrentView }) => {
    const [denetimler, setDenetimler] = useState([]);

    useEffect(() => {
        const fetchDenetimler = async () => {
            const kaydedilenDenetimler = await getDenetimler();
            setDenetimler(kaydedilenDenetimler);
        };
        fetchDenetimler();
    }, []);

    return (
        <div className="denetim-listesi">
            <h2>Kaydedilmiş Denetimlerim</h2>
            {denetimler.length > 0 ? (
                <ul>
                    {denetimler.map(denetim => (
                        <li key={denetim.id}>
                            <p>Tarih: {new Date(denetim.tarih).toLocaleString()}</p>
                            <p>Konum: Lat: {denetim.konum.latitude}, Lon: {denetim.konum.longitude}</p>
                            {/* İsteğe bağlı olarak daha fazla detay gösterebiliriz */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Henüz kaydedilmiş denetim bulunmuyor.</p>
            )}
            <div className="form-action-buttons">
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
        </div>
    );
};

export default DenetimListesi;