import React from 'react';

const DenetimDetayi = ({ selectedDenetim, setCurrentView }) => {
    if (!selectedDenetim) {
        return <div>Denetim detayları bulunamadı.</div>;
    }

    return (
        <div className="denetim-detay">
            <h2>Denetim Detayları</h2>
            <p>Tarih: {new Date(selectedDenetim.tarih).toLocaleString()}</p>
            {selectedDenetim.konum && (
                <p>Konum: Lat: {selectedDenetim.konum.latitude}, Lon: {selectedDenetim.konum.longitude}</p>
            )}
            <h3>Kontrol Maddeleri</h3>
            <ul>
                {selectedDenetim.formData.map(madde => (
                    <li key={madde.id}>
                        <h4>{madde.madde}</h4>
                        <p>Durum: {madde.durum}</p>
                        {madde.durum === 'Uygun Değil' && (
                            <>
                                <p>Not: {madde.not}</p>
                                {madde.foto && <img src={madde.foto} alt="Hata Kanıtı" />}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={() => setCurrentView('list')}>Listeye Geri Dön</button>
        </div>
    );
};

export default DenetimDetayi;