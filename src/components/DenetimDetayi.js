// src/components/DenetimDetayi.js

import React from 'react';

const DenetimDetayi = ({ selectedDenetim, setCurrentView }) => {
    if (!selectedDenetim) {
        return (
            <div className="denetim-detayi">
                <p>Detaylar görüntülenemiyor. Lütfen listeden bir denetim seçin.</p>
                <div className="form-action-buttons">
                    <button onClick={() => setCurrentView('dashboard')}>Geri Dön</button>
                </div>
            </div>
        );
    }

    const hatalıMaddeler = selectedDenetim.formData.filter(madde => madde.durum === 'Uygun Değil');

    return (
        <div className="denetim-detayi">
            <h2>Denetim Detayı</h2>
            <p><strong>Tarih:</strong> {new Date(selectedDenetim.tarih).toLocaleString()}</p>
            <p><strong>Konum:</strong> Latitude: {selectedDenetim.konum.latitude}, Longitude: {selectedDenetim.konum.longitude}</p>

            <h3>Hatalı Maddeler</h3>
            {hatalıMaddeler.length > 0 ? (
                hatalıMaddeler.map(madde => (
                    <div key={madde.id} className="hatalı-madde-detay">
                        <h4>{madde.metin}</h4>
                        {madde.not && <p><strong>Not:</strong> {madde.not}</p>}
                        {madde.foto && (
                            <img src={madde.foto} alt="Hatalı durum fotoğrafı" style={{ maxWidth: '300px', height: 'auto' }} />
                        )}
                    </div>
                ))
            ) : (
                <p>Bu denetimde hatalı madde bulunmuyor.</p>
            )}

            <div className="form-action-buttons">
                <button onClick={() => setCurrentView('dashboard')}>Geri Dön</button>
            </div>
        </div>
    );
};

export default DenetimDetayi;