import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DenetimFormu = () => {
  // Form verilerini tutmak için state hook'u
  const [formData, setFormData] = useState({
    denetimTuru: '',
    denetimYeri: '',
    denetciAdi: '',
    denetimTarihi: '',
    bulgular: '',
    aciklamalar: '',
  });
  
  // Başarılı kaydetme sonrası mesaj göstermek için state
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hata mesajlarını tutmak için state
  const [errorMessage, setErrorMessage] = useState('');

  // Form inputları değiştiğinde state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submit edildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zorunlu alanların kontrolü
    if (!formData.denetimTuru || !formData.denetimYeri || !formData.denetciAdi) {
      setErrorMessage('Lütfen zorunlu alanları doldurun.');
      return;
    }

    try {
      // Form verilerini Firestore'a ekliyoruz
      await addDoc(collection(db, 'denetimler'), {
        ...formData,
        createdAt: serverTimestamp(), // Sunucu zaman damgası ekliyoruz
      });
      
      // Başarılı mesajı ayarlayıp formu sıfırlıyoruz
      setSuccessMessage('Denetim başarıyla kaydedildi!');
      setErrorMessage('');
      setFormData({
        denetimTuru: '',
        denetimYeri: '',
        denetciAdi: '',
        denetimTarihi: '',
        bulgular: '',
        aciklamalar: '',
      });

    } catch (error) {
      console.error('Denetim kaydedilirken bir hata oluştu:', error);
      setErrorMessage('Bir hata oluştu, lütfen tekrar deneyin.');
      setSuccessMessage('');
    }
  };

  // Başarı mesajını belirli bir süre sonra kaldırmak için useEffect hook'u
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // 5 saniye sonra mesajı kaldır
      return () => clearTimeout(timer); // Komponent unmount olduğunda timer'ı temizle
    }
  }, [successMessage]);

  return (
    <div className="denetim-formu-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <h2>Yeni Denetim Formu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="denetimTuru">Denetim Türü:</label>
          <input
            type="text"
            id="denetimTuru"
            name="denetimTuru"
            value={formData.denetimTuru}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="denetimYeri">Denetim Yeri:</label>
          <input
            type="text"
            id="denetimYeri"
            name="denetimYeri"
            value={formData.denetimYeri}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="denetciAdi">Denetçi Adı:</label>
          <input
            type="text"
            id="denetciAdi"
            name="denetciAdi"
            value={formData.denetciAdi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="denetimTarihi">Denetim Tarihi:</label>
          <input
            type="date"
            id="denetimTarihi"
            name="denetimTarihi"
            value={formData.denetimTarihi}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bulgular">Bulgular:</label>
          <textarea
            id="bulgular"
            name="bulgular"
            value={formData.bulgular}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="aciklamalar">Açıklamalar:</label>
          <textarea
            id="aciklamalar"
            name="aciklamalar"
            value={formData.aciklamalar}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">Kaydet</button>
      </form>
    </div>
  );
};

export default DenetimFormu;
