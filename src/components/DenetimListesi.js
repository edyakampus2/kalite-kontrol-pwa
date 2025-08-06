// src/components/DenetimListesi.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService'; // IndexedDB servisinden çekme
import MessageModal from './MessageModal'; // Mesaj modalını dahil ediyoruz

const DenetimListesi = ({ setCurrentView }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    useEffect(() => {
        const fetchDenetimler = async () => {
            try {
                // Önce uzaktaki sunucudan verileri çekmeyi dene
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                setDenetimler(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Denetimler sunucudan getirilirken hata oluştu, IndexedDB'den çekiliyor:", err);
                // Sunucudan veri çekilemezse, IndexedDB'den çekmeyi dene
                try {
                    const indexedDBDenetimler = await getDenetimlerFromIndexedDB();
                    setDenetimler(indexedDBDenetimler);
                    setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                    setShowModal(true);
                } catch (indexedDBError) {
                    console.error("IndexedDB'den denetimler getirilirken hata oluştu:", indexedDBError);
                    setError('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                }
                setLoading(false);
            }
        };

        fetchDenetimler();
    }, []);

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

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
                        <li key={denetim._id || denetim.id}> {/* Hem _id (MongoDB) hem de id (IndexedDB) için */}
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
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default DenetimListesi;
