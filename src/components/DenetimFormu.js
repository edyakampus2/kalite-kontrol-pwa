import React, { useState, useEffect } from 'react';
import { saveDenetim } from '../services/IndexedDBService';
import { getFormMaddeleri } from '../data/FormVerileri';
import MessageModal from './MessageModal';

const DenetimFormu = ({ setCurrentView, setRefreshTrigger }) => {
    const [formData, setFormData] = useState([]);
    const [konum, setKonum] = useState(null);
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

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 600; // Fotoğrafın maksimum boyutu
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Kalite 0.7
                setFormData(prevData =>
                    prevData.map(madde =>
                        madde.id === maddeId ? { ...madde, foto: compressedDataUrl } : madde
                    )
                );
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const eksikKontroller = formData.filter(item => item.durum === null);
        if (eksikKontroller.length > 0) {
            setModalMessage('Lütfen tüm kontrol maddelerini doldurun.');
            setShowModal(true);
            return;
        }

        try {
            const yeniDenetim = {
                tarih: new Date().toISOString(),
                konum: konum || { latitude: 'Bilinmiyor', longitude: 'Bilinmiyor' },
                formData: formData,
            };
            await saveDenetim(yeniDenetim);
            setModalMessage("Denetim taslağı başarıyla kaydedildi.");
            setShowModal(true);
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error("Denetim kaydedilirken hata oluştu:", error);
            setModalMessage("Denetim kaydedilirken bir hata oluştu.");
            setShowModal(true);
        }
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
        setCurrentView('menu');
    };

    return (
        <div className="denetim-formu">
            <h2>Yeni Denetim Formu</h2>
            <p>Tarih: {new Date().toLocaleString()}</p>
            <p>Konum: {konum ? `Lat: ${konum.latitude}, Lon: ${konum.longitude}` : 'Konum bilgisi alınıyor...'}</p>
            {formData.map(madde => (
                <div key={madde.id} className="kontrol-maddesi">
                    <h3>{madde.madde}</h3>
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
            {showModal && (
                <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />
            )}
        </div>
    );
};

export default DenetimFormu;