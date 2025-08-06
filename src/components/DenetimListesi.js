// src/components/DenetimListesi.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios'u dahil ediyoruz

const DenetimListesi = ({ setCurrentView }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDenetimler = async () => {
            try {
                // Backend'den verileri çeken GET isteği
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                setDenetimler(response.data.data); // Backend'in gönderdiği veriyi state'e kaydediyoruz
                setLoading(false);
            } catch (err) {
                console.error("Denetimler getirilirken hata oluştu:", err);
                setError('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                setLoading(false);
            }
        };

        fetchDenetimler();
    }, []);

    if (loading) {
        return <div className="denetim-listesi">Veriler yükleniyor...</div>;
    }

    if (error) {
        return <div className="denetim-listesi">{error}</div>;
    }

    return (
        <div className="denetim-listesi">
            <h2>Kaydedilmiş Denetimlerim</h2>
            {denetimler.length > 0 ? (
                <ul>
                    {denetimler.map(denetim => (
                        <li key={denetim._id}>
                            <p>Tarih: {new Date(denetim.tarih).toLocaleString()}</p>
                            <p>Konum: Lat: {denetim.konum.latitude}, Lon: {denetim.konum.longitude}</p>
                            {/* Diğer denetim detayları buraya eklenebilir */}
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