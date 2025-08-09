// Tarih: 2025-08-09 Saat: 17:45
// Kod Grup Açıklaması: Yedekleme bileşenine saveDenetim fonksiyonunun import edilmesi.
import React, { useState } from 'react';
import { getDenetimler, clearDenetimler, saveDenetim } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const Yedekleme = ({ setCurrentView }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleBackup = async () => {
        try {
            const denetimler = await getDenetimler();
            if (denetimler.length === 0) {
                setModalMessage('Yedeklenecek denetim bulunamadı.');
                setShowModal(true);
                return;
            }

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(denetimler, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "denetim-yedek-" + new Date().toISOString() + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            setModalMessage('Yedekleme başarılı!');
            setShowModal(true);
        } catch (error) {
            setModalMessage('Yedekleme sırasında bir hata oluştu.');
            setShowModal(true);
        }
    };

    const handleRestore = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const restoredDenetimler = JSON.parse(e.target.result);
                if (!Array.isArray(restoredDenetimler)) {
                    setModalMessage('Hatalı dosya formatı. Lütfen geçerli bir JSON dosyası seçin.');
                    setShowModal(true);
                    return;
                }

                await clearDenetimler();
                for (const denetim of restoredDenetimler) {
                    await saveDenetim(denetim);
                }
                setModalMessage('Geri yükleme başarılı!');
                setShowModal(true);
            } catch (error) {
                setModalMessage('Geri yükleme sırasında bir hata oluştu.');
                setShowModal(true);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="yedekleme-container">
            <h2>Yedekleme ve Geri Yükleme</h2>
            <div className="yedekleme-buttons">
                <button onClick={handleBackup}>Yedekle (JSON)</button>
                <div>
                    <label className="custom-file-upload">
                        Geri Yükle (JSON)
                        <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>
            <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            {showModal && <MessageModal message={modalMessage} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Yedekleme;