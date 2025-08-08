// Tarih: 08.08.2025 Saat: 12:45
// src/components/DenetimFormu.js

import React, { useState, useEffect } from 'react';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';
import MessageModal from './MessageModal';

// Dosyayı Base64 stringine dönüştüren yardımcı fonksiyon
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const DenetimFormu = ({ setCurrentView }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const maddeler = getFormMaddeleri();
        setFormData(maddeler);

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
        if (!file) return;

        fileToBase64(file).then(base64String => {
            setFormData(prevData =>
                prevData.map(madde =>
                    madde.id === maddeId ? { ...madde, foto: base64String } : madde
                )
            );
        }).catch(error => {
            console.error("Fotoğraf dönüştürme hatası:", error);
            setModalMessage("Fotoğraf dönüştürülürken bir hata oluştu.");
            setShowModal(true);
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Form verilerini kontrol edip gönderilecek hale getirme
        const denetimData = {
            tarih: new Date(),
            konum: konum,
            formData: formData,
        };

        try {
            await saveDenetim(denetimData);
            setModalMessage("Denetim başarıyla kaydedildi.");
            setShowModal(true);
            setLoading(false);
            setCurrentView('menu');
        } catch (error) {
            console.error("Denetim kaydedilirken hata oluştu:", error);
            setModalMessage("Denetim kaydedilirken bir hata oluştu.");
            setShowModal(true);
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="denetim-formu">
            {loading && <p>Kaydediliyor...</p>}
            <h2>Yeni Denetim</h2>
            {formData.map(madde => (
                <div key={madde.id} className="kontrol-maddesi">
                    <h4>{madde.metin}</h4>
                    <div className="durum-secenekleri">
                        <button onClick={() => handleDurumChange(madde.id, 'Uygun')} className={madde.durum === 'Uygun' ? 'active' : ''}>Uygun</button>
                        <button onClick={() => handleDurumChange(madde.id, 'Uygun Değil')} className={madde.durum === 'Uygun Değil' ? 'active' : ''}>Uygun Değil</button>
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
                                value={madde.not || ''}
                            ></textarea>
                            {madde.foto && (
                                <img src={madde.foto} alt="Kanıt" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div className="form-action-buttons">
                <button onClick={handleSubmit}>Taslak Kaydet</button>
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
            {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default DenetimFormu;
