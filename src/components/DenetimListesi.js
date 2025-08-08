// Tarih: 08.08.2025 Saat: 13:45
// src/components/DenetimListesi.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const DenetimListesi = ({ navigateTo, refreshTrigger }) => { // navigateTo prop'u eklendi
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchDenetimler = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                setDenetimler(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Denetimler sunucudan getirilirken hata oluştu, IndexedDB'den çekiliyor:", err);
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
    }, [refreshTrigger]);

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    const handleDenetimClick = (denetim) => {
      navigateTo('denetimDetayi', denetim); // Yeni navigateTo fonksiyonu kullanıldı
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
                        <li key={denetim._id || denetim.id} onClick={() => handleDenetimClick(denetim)}>
                            <p>Tarih: {denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}</p>
                            <p>Konum: Lat: {denetim.konum?.latitude || 'N/A'}, Lon: {denetim.konum?.longitude || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Henüz kaydedilmiş denetim bulunmuyor.</p>
            )}
            <div className="form-action-buttons">
                <button onClick={() => navigateTo('menu')}>Ana Menüye Dön</button>
            </div>
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default DenetimListesi;
