// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';

const Dashboard = ({ setCurrentView, setSelectedDenetim }) => { // Yeni prop eklendi
    const [dashboardData, setDashboardData] = useState(null);
    const [denetimler, setDenetimler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard');
                if (!response.ok) {
                    throw new Error('Dashboard verileri çekilemedi.');
                }
                const data = await response.json();
                setDashboardData(data.ozet);
                setDenetimler(data.data); // Tüm denetim verisini de kaydet
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleDenetimClick = (denetim) => {
        setSelectedDenetim(denetim);
        setCurrentView('denetimDetayi'); // Yeni bir görünüme geçiş
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
                        <li key={denetim._id} onClick={() => handleDenetimClick(denetim)}>
                            ({index + 1}) Tarih: {new Date(denetim.tarih).toLocaleString()}
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Henüz hatalı denetim bulunmuyor.</p>
            )}

            <div className="form-action-buttons">
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
        </div>
    );
};

export default Dashboard;