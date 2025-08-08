// src/components/DenetimFormu.js

import React, { useState, useEffect } from 'react';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';

const DenetimFormu = ({ setCurrentView }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);

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
        // Fotoğrafı Base64'e çevirme ve state'e kaydetme
        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prevData =>
                prevData.map(madde =>
                    madde.id === maddeId ? { ...madde, foto: e.target.result } : madde
                )
            );
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const denetim = {
            tarih: new Date().toISOString(),
            konum: konum,
            formData: formData
        };
        await saveDenetim(denetim);
        alert('Denetim başarıyla kaydedildi!');
        setCurrentView('menu');
    };

    return (
        <div className="denetim-formu">
            <h2>Kaba İnşaat Kontrol Formu</h2>
            <p>Konum: {konum ? `Enlem: ${konum.latitude}, Boylam: ${konum.longitude}` : 'Konum alınıyor...'}</p>
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
                <button onClick={handleSubmit}>Taslak Kaydet</button>
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
        </div>
    );
};

export default DenetimFormu;
