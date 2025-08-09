// Tarih: 2025-08-09 17:15:00
// Kod Grup Açıklaması: Dashboard bileşenindeki kullanılmayan setModalMessage değişkeninin kaldırılması.
import React, { useState, useEffect } from 'react';
import MessageModal from './MessageModal';
import { getDenetimler } from '../services/IndexedDBService';

const Dashboard = ({ setCurrentView, setSelectedDenetim, refreshTrigger }) => {
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage] = useState(''); // Düzeltildi: 'setModalMessage' kaldırıldı

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Tarih: 2025-08-09 17:15:00
                // Kod Grup Açıklaması: Sabit kodlanmış veriler yerine IndexedDB'den tüm denetimleri çekme.
                const allDenetimler = await getDenetimler();
                
                if (Array.isArray(allDenetimler)) {
                    setDenetimler(allDenetimler);
                } else {
                    setDenetimler([]);
                }
            } catch (dbError) {
                setError('Hata: Veriler yerel depodan da alınamadı. Lütfen daha sonra tekrar deneyin.');
                console.error('IndexedDB’den veri çekilirken hata oluştu:', dbError);
            } finally {
                setLoading(false);
                if (modalMessage) setShowModal(true);
            }
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