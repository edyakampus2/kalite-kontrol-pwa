// Tarih: 08.08.2025 Saat: 13:45
// src/components/DenetimDetayi.js

import React from 'react';
import MessageModal from './MessageModal';

const DenetimDetayi = ({ navigateTo, selectedDenetim, previousView }) => { // previousView prop'u eklendi
    if (!selectedDenetim) {
        return (
            <div className="denetim-detayi">
                <p>Detayları görüntülenecek denetim bulunamadı.</p>
                <div className="form-action-buttons">
                    <button onClick={() => navigateTo(previousView || 'menu')}>Geri Dön</button>
                </div>
            </div>
        );
    }

    return (
        <div className="denetim-detayi">
            <h2>Denetim Detayı</h2>
            <p><strong>Tarih:</strong> {new Date(selectedDenetim.tarih).toLocaleString()}</p>
            <p><strong>Konum:</strong> Lat: {selectedDenetim.konum.latitude}, Lon: {selectedDenetim.konum.longitude}</p>

            <h3>Kontrol Maddeleri</h3>
            <ul>
                {selectedDenetim.formData.map(madde => (
                    <li key={madde.id}>
                        <h4>{madde.metin}</h4>
                        <p><strong>Durum:</strong> {madde.durum}</p>
                        {madde.not && <p><strong>Not:</strong> {madde.not}</p>}
                        {madde.foto && <img src={madde.foto} alt="Kanıt" style={{ maxWidth: '200px' }} />}
                    </li>
                ))}
            </ul>

            <div className="form-action-buttons">
                <button onClick={() => navigateTo(previousView || 'menu')}>Geri Dön</button> {/* previousView kullanıldı */}
            </div>
        </div>
    );
};

export default DenetimDetayi;
