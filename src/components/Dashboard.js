// Tarih: 08.08.2025
// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => {
    // denetimler state'ini boş bir dizi olarak başlatıyoruz
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            let allDenetimler = [];

            if (navigator.onLine) {
                try {
                    const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/denetimler');
                    // API'den gelen veriyi doğru şekilde (response.data.data) alıyoruz
                    if (response.data && Array.isArray(response.data.data)) {
                        allDenetimler = response.data.data;
                    } else {
                        console.error('API’den gelen veri beklenildiği gibi değil:', response.data);
                        throw new Error('API verisi beklenildiği gibi değil.');
                    }
                    console.log('Veriler sunucudan çekildi.');
                } catch (apiError) {
                    console.error('API’den veri çekilirken hata oluştu, IndexedDB’den çekiliyor:', apiError);
                    try {
                        allDenetimler = await getDenetimlerFromIndexedDB();
                        setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                    } catch (dbError) {
                        setError('Hata: Veriler yerel depodan da alınamadı. Lütfen daha sonra tekrar deneyin.');
                        console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                    }
                }
            } else {
                try {
                    allDenetimler = await getDenetimlerFromIndexedDB();
                    setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                } catch (dbError) {
                    setError('Hata: Çevrimdışı modda veriler yerel depodan alınamadı. Lütfen daha sonra tekrar deneyin.');
                    console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
                }
            }

            if (Array.isArray(allDenetimler)) {
                setDenetimler(allDenetimler);
            } else {
                setDenetimler([]);
            }

            setLoading(false);
            if(modalMessage) setShowModal(true);
        };

        fetchDashboardData();
    }, [refreshTrigger, modalMessage]);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) return <div>Veriler yükleniyor...</div>;
    if (error) return <div>Hata: {error}</div>;

    const hatalıDenetimler = denetimler.filter(d => d.formData && d.formData.some(m => m.durum === 'Uygun Değil'));

    return (
        <div className="dashboard-container">
            <h2>Genel Denetim Özeti</h2>
            <p>Toplam Yapılan Denetim Sayısı: <strong>{denetimler.length}</strong></p>

            <h3>Hatalı Denetimler</h3>
            {hatalıDenetimler.length > 0 ? (
                <ol>
                    {hatalıDenetimler.map((denetim, index) => (
                        <li key={denetim._id || denetim.id} onClick={() => handleDenetimClick(denetim)}>
                            ({index + 1}) Tarih: {denetim.tarih ? new Date(denetim.tarih).toLocaleString() : 'Tarih bilgisi yok'}
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Harika! Henüz hatalı denetim bulunmuyor.</p>
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

export default Dashboard;
