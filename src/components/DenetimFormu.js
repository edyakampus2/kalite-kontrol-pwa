// Tarih: 2025-08-09 14:56:44
// Kod Grup Açıklaması: Denetim Formu Bileşeninin Mesaj Modalı import yolu düzeltmesi
import React, { useState } from 'react';
import MessageModal from './MessageModal'; // Düzeltildi: 'MessageModal.js' dosyasının yolu güncellendi.

const DenetimFormu = ({ setCurrentView }) => {
    // Kontrol listesi için örnek veri
    const initialKontrolListesi = [
        { metin: "Ekipmanlar kontrol edildi mi?", durum: null, not: "" },
        { metin: "Çalışma alanı temiz mi?", durum: null, not: "" },
        { metin: "Güvenlik önlemleri alındı mı?", durum: null, not: "" },
        { metin: "Kalite standartları karşılanıyor mu?", durum: null, not: "" },
    ];
    const [kontrolListesi, setKontrolListesi] = useState(initialKontrolListesi);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleDurumChange = (index, durum) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].durum = durum;
        setKontrolListesi(yeniListe);
    };

    const handleNotChange = (index, not) => {
        const yeniListe = [...kontrolListesi];
        yeniListe[index].not = not;
        setKontrolListesi(yeniListe);
    };

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
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.metin}</h3>
                            <div className="flex items-center space-x-4 mb-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`durum-${index}`}
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
                                        name={`durum-${index}`}
                                        value="Uygun Değil"
                                        checked={item.durum === 'Uygun Değil'}
                                        onChange={() => handleDurumChange(index, 'Uygun Değil')}
                                        className="form-radio h-4 w-4 text-red-600"
                                    />
                                    <span className="ml-2 text-gray-700">Uygun Değil</span>
                                </label>
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