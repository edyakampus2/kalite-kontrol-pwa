// src/components/DenetimFormu.js

import React, { useState, useEffect } from 'react';
import { saveDenetim } from '../services/IndexedDBService'; // IndexedDB servisi
import { getFormMaddeleri } from '../data/FormVerileri';
import MessageModal from './MessageModal'; // Mesaj modalını dahil ediyoruz

const DenetimFormu = ({ setCurrentView, setRefreshTrigger }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // Form verilerini statik bir dosyadan yükle
        const maddeler = getFormMaddeleri();
        setFormData(maddeler);

        // Sayfa açıldığında konumu al
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

    // FOTOĞRAF ÇEKME VE OPTİMİZASYON FONKSİYONU
    const handleFotoChange = async (maddeId, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Maksimum genişlik
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Kaliteyi düşürerek (0.7) JPEG formatında Base64'e dönüştür
                const optimizedImage = canvas.toDataURL('image/jpeg', 0.7);

                setFormData(prevData =>
                    prevData.map(madde =>
                        madde.id === maddeId ? { ...madde, foto: optimizedImage } : madde
                    )
                );
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const denetim = {
            tarih: new Date().toISOString(),
            konum: konum,
            formData: formData
        };

        try {
            const response = await fetch('https://kalite-kontrol-api.onrender.com/api/denetimler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(denetim),
            });

            if (response.ok) {
                setModalMessage('Denetim başarıyla sunucuya gönderildi!');
                setShowModal(true);
                await saveDenetim(denetim);
            } else {
                const errorData = await response.json();
                setModalMessage(`Sunucuya veri gönderilirken bir hata oluştu: ${errorData.message || response.statusText}`);
                setShowModal(true);
                await saveDenetim(denetim);
            }
        } catch (error) {
            setModalMessage('Bağlantı hatası: Sunucuya ulaşılamıyor. Veri yerel olarak kaydediliyor.');
            setShowModal(true);
            await saveDenetim(denetim);
        } finally {
            // Kaydetme işlemi bittiğinde veri yenileme tetikleyicisini çalıştır
            if(setRefreshTrigger) {
                setRefreshTrigger(prev => !prev);
            }
        }
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
        setCurrentView('menu');
    };

    return (
        <div className="denetim-formu">
            <h2>Kaba İnşaat Kontrol Formu</h2>
            <p>Konum: {konum ? `Lat: ${konum.latitude}, Lon: ${konum.longitude}` : 'Konum alınıyor...'}</p>
            {formData.map(madde => (
                <div key={madde.id} className="kontrol-maddesi">
                    <h4>{madde.metin}</h4>
                    <div className="durum-secenekleri">
                        <button onClick={() => handleDurumChange(madde.id, 'Uygun')}>Uygun</button>
                        <button onClick={() => handleDurumChange(madde.id, 'Uygun Değil')}>Uygun Değil</button>
                    </div>
                    {madde.durum === 'Uygun Değil' && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment" // Arka kamerayı açar
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
            <button onClick={handleSubmit}>Taslak Kaydet</button>
            <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>

            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default DenetimFormu;
