// src/components/DenetimFormu.js
// Tarih: 08.08.2025 Saat: 14:00

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';
import MessageModal from './MessageModal';

const DenetimFormu = ({ setCurrentView, setRefreshTrigger }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // Form maddelerini yükle
        const maddeler = getFormMaddeleri();
        setFormData(maddeler);

        // Kullanıcının konumunu al
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setKonum({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Konum bilgisi alınamadı:", error);
                }
            );
        }
    }, []);

    const handleDurumChange = (maddeId, durum) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, durum } : madde
            )
        );
    };

    const handleNotChange = (maddeId, not) => {
        setFormData(prevData =>
            prevData.map(madde =>
                madde.id === maddeId ? { ...madde, not } : madde
            )
        );
    };

    const handleFotoChange = (maddeId, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prevData =>
                prevData.map(madde =>
                    madde.id === maddeId ? { ...madde, foto: reader.result } : madde
                )
            );
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const denetim = {
            tarih: new Date().toISOString(),
            konum,
            kontrolListesi: formData.map(({ foto, ...rest }) => ({
                ...rest,
                // Fotoğraf verisi varsa Base64 kısmını al
                foto: foto ? foto.split(',')[1] : null,
            })),
        };

        try {
            // Önce sunucuya kaydetmeyi dene
            await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetim);
            setModalMessage('Denetim başarıyla sunucuya kaydedildi!');
        } catch (error) {
            console.error("Denetim sunucuya kaydedilirken hata oluştu, IndexedDB'ye kaydediliyor:", error);
            try {
                // Sunucuya kaydedemezse, IndexedDB'ye kaydet
                await saveDenetim(denetim);
                setModalMessage('İnternet bağlantısı yok. Denetim yerel depolama alanına kaydedildi.');
            } catch (indexedDBError) {
                console.error("Denetim IndexedDB'ye kaydedilirken hata oluştu:", indexedDBError);
                setModalMessage('Veri kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setLoading(false);
            setShowModal(true);
            // Denetim listesinin yenilenmesi için tetikleyiciyi güncelle
            setRefreshTrigger(prev => !prev);
        }
    };
    
    const closeModal = () => {
        setShowModal(false);
        // Modal kapatıldığında ana menüye dön
        setCurrentView('menu');
    };

    return (
        <div className="denetim-formu">
            <h2>Yeni Denetim Formu</h2>
            <div className="form-action-buttons">
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                </button>
                <button onClick={() => setCurrentView('menu')} disabled={loading}>Ana Menüye Dön</button>
            </div>
            {formData.map(madde => (
                <div key={madde.id} className="kontrol-maddesi">
                    <h4>{madde.madde}</h4>
                    <div className="durum-secenekleri">
                        <button
                            className={madde.durum === 'Uygun' ? 'active' : ''}
                            onClick={() => handleDurumChange(madde.id, 'Uygun')}
                        >
                            Uygun
                        </button>
                        <button
                            className={madde.durum === 'Uygun Değil' ? 'active' : ''}
                            onClick={() => handleDurumChange(madde.id, 'Uygun Değil')}
                        >
                            Uygun Değil
                        </button>
                    </div>
                    {madde.durum === 'Uygun Değil' && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={e => handleFotoChange(madde.id, e.target.files[0])}
                            />
                            <textarea
                                placeholder="Not ekle..."
                                onChange={e => handleNotChange(madde.id, e.target.value)}
                            ></textarea>
                            {madde.foto && (
                                <img src={madde.foto} alt="Kanıt" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div className="form-action-buttons">
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                </button>
                <button onClick={() => setCurrentView('menu')} disabled={loading}>Ana Menüye Dön</button>
            </div>
            {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default DenetimFormu;
