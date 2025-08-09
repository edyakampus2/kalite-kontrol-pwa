import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const DenetimListesi = ({ setCurrentView, refreshTrigger, setSelectedDenetim }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage] = useState('');

    useEffect(() => {
        const fetchDenetimler = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                setDenetimler(response.data.data);
            } catch (err) {
                console.error("Denetimler sunucudan getirilirken hata oluştu, IndexedDB'den çekiliyor:", err);
                try {
                    const indexedDBDenetimler = await getDenetimlerFromIndexedDB();
                    setDenetimler(indexedDBDenetimler);
                } catch (indexedDBError) {
                    console.error("IndexedDB'den denetimler getirilirken hata oluştu:", indexedDBError);
                    setError('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDenetimler();
    }, [refreshTrigger]);

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) {
        return <div className="denetim-listesi">Veriler yükleniyor...</div>;
    }

    if (error) {
        return <div className="denetim-listesi">{error}</div>;
    }

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

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
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default DenetimListesi;