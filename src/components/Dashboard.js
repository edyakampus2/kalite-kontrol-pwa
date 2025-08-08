// Tarih: 08.08.2025 Saat: 13:30
// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios'u dahil ediyoruz
import { getDenetimler as getDenetimlerFromIndexedDB } from '../services/IndexedDBService'; // IndexedDB servisinden çekme
import MessageModal from './MessageModal'; // Mesaj modalını dahil ediyoruz

const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => { // refreshTrigger prop'u eklendi
    const [dashboardData, setDashboardData] = useState(null);
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true); // Veri çekme başladığında yükleniyor durumunu ayarla
            try {
                // Önce uzaktaki sunucudan verileri çekmeyi dene
                const response = await axios.get('https://kalite-kontrol-api.onrender.com/api/dashboard');
                setDashboardData(response.data.ozet);
                setDenetimler(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard verileri sunucudan getirilirken hata oluştu, IndexedDB'den çekiliyor:", err);
                // Sunucudan veri çekilemezse, IndexedDB'den çekmeyi dene
                try {
                    const indexedDBDenetimler = await getDenetimlerFromIndexedDB();
                    // IndexedDB'den gelen veriyi dashboard formatına dönüştürme
                    const ozet = {
                        toplamDenetim: indexedDBDenetimler.length,
                        hataSayilari: {},
                        hataFotograflari: []
                    };

                    indexedDBDenetimler.forEach(denetim => {
                        denetim.formData.forEach(madde => {
                            if (madde.durum === 'Uygun Değil') {
                                if (ozet.hataSayilari[madde.metin]) {
                                    ozet.hataSayilari[madde.metin]++;
                                } else {
                                    ozet.hataSayilari[madde.metin] = 1;
                                }
                                if (madde.foto) {
                                    ozet.hataFotograflari.push({
                                        madde: madde.metin,
                                        not: madde.not,
                                        foto: madde.foto,
                                        tarih: denetim.tarih
                                    });
                                }
                            }
                        });
                    });

                    setDashboardData(ozet);
                    setDenetimler(indexedDBDenetimler);
                    setModalMessage('İnternet bağlantısı yok. Veriler yerel depolamadan getirildi.');
                    setShowModal(true);
                } catch (indexedDBError) {
                    console.error("IndexedDB'den dashboard verileri getirilirken hata oluştu:", indexedDBError);
                    setError('Veriler getirilemedi. Lütfen daha sonra tekrar deneyin.');
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [refreshTrigger]); // refreshTrigger değiştiğinde verileri yeniden çek

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi');
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (loading) return <div>Veriler yükleniyor...</div>;
    if (error) return <div>Hata: {error}</div>;
    if (!dashboardData) return <div>Veri bulunamadı.</div>;

    const hatalıDenetimler = denetimler.filter(d => d.formData.some(m => m.durum === 'Uygun Değil'));

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
                <p>Henüz hatalı denetim bulunmuyor.</p>
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
