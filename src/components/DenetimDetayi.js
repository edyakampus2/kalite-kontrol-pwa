// Tarih: 08.08.2025 Saat: 13:45
// src/components/DenetimDetayi.js

import React from 'react';

// Denetim Detaylarını gösteren bileşen.
// `navigateTo`, `selectedDenetim` ve `previousView` gibi prop'ları alır.
const DenetimDetayi = ({ navigateTo, selectedDenetim, previousView }) => {
    
    // Eğer görüntülenecek bir denetim seçilmediyse (selectedDenetim boşsa),
    // kullanıcıya bir hata mesajı göster ve geri dön butonu ekle.
    if (!selectedDenetim) {
        return (
            <div className="denetim-detayi">
                <p>Detayları görüntülenecek denetim bulunamadı.</p>
                <div className="form-action-buttons">
                    {/* Geri dön butonu. Önceki sayfa bilgisi varsa oraya, yoksa ana menüye yönlendirir. */}
                    <button onClick={() => navigateTo(previousView || 'menu')}>Geri Dön</button>
                </div>
            </div>
        );
    }

    // Denetim verileri mevcutsa, detayları gösteren ana yapıyı oluştur.
    return (
        <div className="denetim-detayi">
            <h2>Denetim Detayı</h2>
            {/* Denetim tarihini formatlayarak gösterir. */}
            <p><strong>Tarih:</strong> {new Date(selectedDenetim.tarih).toLocaleString()}</p>
            {/* Denetim konum bilgilerini gösterir. */}
            <p><strong>Konum:</strong> Lat: {selectedDenetim.konum.latitude}, Lon: {selectedDenetim.konum.longitude}</p>

            <h3>Kontrol Maddeleri</h3>
            <ul>
                {/* Denetim verisindeki her bir madde için bir liste öğesi oluşturur. */}
                {selectedDenetim.formData.map(madde => (
                    <li key={madde.id}>
                        <h4>{madde.metin}</h4>
                        <p><strong>Durum:</strong> {madde.durum}</p>
                        {/* Eğer not varsa, notu gösterir. */}
                        {madde.not && <p><strong>Not:</strong> {madde.not}</p>}
                        {/* Eğer fotoğraf varsa, fotoğrafı gösterir. */}
                        {madde.foto && <img src={madde.foto} alt="Kanıt" style={{ maxWidth: '200px' }} />}
                    </li>
                ))}
            </ul>

            <div className="form-action-buttons">
                {/* Geri dön butonu. Önceki sayfa bilgisi varsa oraya, yoksa ana menüye yönlendirir. */}
                <button onClick={() => navigateTo(previousView || 'menu')}>Geri Dön</button>
            </div>
        </div>
    );
};

export default DenetimDetayi;
