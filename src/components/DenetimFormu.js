// Tarih: 2025-08-09 15:15:00
// Kod Grup Açıklaması: DenetimFormu bileşeninin yeni gereksinimlere göre güncellenmiş hali.
// Bu güncelleme ile kontrol maddeleri harici bir dosyadan (FormVerileri.js) alınıyor
// ve her madde için fotoğraf ekleme işlevi ekleniyor.
import React, { useState } from 'react';
import MessageModal from './MessageModal';
import { getFormMaddeleri } from '../data/FormVerileri'; // Düzeltildi: Kontrol maddeleri FormVerileri.js dosyasından import ediliyor.

const DenetimFormu = ({ setCurrentView }) => {
    // Tarih: 2025-08-09 15:15:00
    // Kod Grup Açıklaması: Kontrol listesi için veriyi FormVerileri.js dosyasından alıyoruz.
    const [kontrolListesi, setKontrolListesi] = useState(getFormMaddeleri());
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Tarih: 2025-08-09 15:15:00
    // Kod Grup Açıklaması: Kontrol maddesinin durumunu (Uygun/Uygun Değil) günceller.
    const handleDurumChange = (index, durum) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].durum = durum;
        setKontrolListesi(yeniListe);
    };

    // Tarih: 2025-08-09 15:15:00
    // Kod Grup Açıklaması: "Uygun Değil" seçildiğinde not alanını günceller.
    const handleNotChange = (index, not) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].not = not;
        setKontrolListesi(yeniListe);
    };

    // Tarih: 2025-08-09 15:15:00
    // Kod Grup Açıklaması: Eklenen fotoğrafın küçük boyutta işlenmesi ve state'e kaydedilmesi.
    const handleFotoChange = (index, file) => {
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
                const yeniListe = [...kontrolListesi];
                yeniListe[index].foto = compressedDataUrl;
                setKontrolListesi(yeniListe);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Tarih: 2025-08-09 15:15:00
    // Kod Grup Açıklaması: Formun kaydedilmesi ve validasyon kontrolü.
    const handleKaydet = () => {
        const eksikKontroller = kontrolListesi.filter(item => item.durum === null);
        if (eksikKontroller.length > 0) {
            setMessage('Lütfen tüm kontrol maddelerini doldurun.');
            setShowModal(true);
            return;
        }

        console.log('Denetim Sonuçları:', kontrolListesi);
        setMessage('Denetim başarıyla kaydedildi!');
        setShowModal(true);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-inter">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Yeni Denetim Formu</h2>
                
                <div className="space-y-6">
                    {kontrolListesi.map((item, index) => (
                        <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.madde}</h3>
                            <div className="flex items-center space-x-4 mb-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${item.id}`}
                                        value="Uygun"
                                        checked={item.durum === 'Uygun'}
                                        onChange={() => handleDurumChange(index, 'Uygun')}
                                        className="form-radio h-4 w-4 text-green-600"
                                    />
                                    <span className="ml-2 text-gray-700">Uygun</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${item.id}`}
                                        value="Uygun Değil"
                                        checked={item.durum === 'Uygun Değil'}
                                        onChange={() => handleDurumChange(index, 'Uygun Değil')}
                                        className="form-radio h-4 w-4 text-red-600"
                                    />
                                    <span className="ml-2 text-gray-700">Uygun Değil</span>
                                </label>
                            </div>

                            {/* Tarih: 2025-08-09 15:15:00 */}
                            {/* Kod Grup Açıklaması: Fotoğraf ekleme ve önizleme alanı. */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Fotoğraf Ekle (isteğe bağlı)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFotoChange(index, e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                                {item.foto && (
                                    <div className="mt-2">
                                        <img src={item.foto} alt="Denetim Fotoğrafı" className="w-32 h-32 object-cover rounded-lg shadow-sm border border-gray-200" />
                                    </div>
                                )}
                            </div>

                            {item.durum === 'Uygun Değil' && (
                                <textarea
                                    value={item.not}
                                    onChange={(e) => handleNotChange(index, e.target.value)}
                                    placeholder="Hatanın sebebini not alın..."
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-8 space-x-4">
                    <button
                        onClick={() => setCurrentView('menu')}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleKaydet}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
            {showModal && (
                <MessageModal
                    message={message}
                    onClose={() => {
                        setShowModal(false);
                        if (message === 'Denetim başarıyla kaydedildi!') {
                            setCurrentView('menu');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default DenetimFormu;