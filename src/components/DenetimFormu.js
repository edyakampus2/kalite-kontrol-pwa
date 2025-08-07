// src/components/DenetimFormu.js

import React, { useState } from 'react';
import { addDenetim } from '../services/IndexedDBService'; // Düzeltilmiş import
import axios from 'axios';
import MessageModal from './MessageModal';

// Denetim form bileşeni
const DenetimFormu = ({ setCurrentView, setRefreshTrigger }) => {
    const [formData, setFormData] = useState([
        { metin: 'Öğe 1', durum: 'Uygun', not: '', foto: '' },
        { metin: 'Öğe 2', durum: 'Uygun', not: '', foto: '' },
        { metin: 'Öğe 3', durum: 'Uygun', not: '', foto: '' },
        // ... Diğer form maddeleri
    ]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleInputChange = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index][field] = value;
        setFormData(newFormData);
    };

    const handleFotoChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange(index, 'foto', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const denetimData = {
            tarih: new Date().toISOString(),
            formData: formData,
        };

        try {
            if (navigator.onLine) {
                // Online ise, sadece sunucuya yükle
                await axios.post('https://kalite-kontrol-api.onrender.com/api/denetimler', denetimData);
                setModalMessage('Denetim başarıyla sunucuya kaydedildi.');
            } else {
                // Offline ise, sadece IndexedDB'ye kaydet
                await addDenetim(denetimData); // Fonksiyon adını düzeltiyoruz
                setModalMessage('İnternet bağlantısı yok. Denetim yerel olarak kaydedildi, bağlantı kurulduğunda senkronize edilecek.');
            }
            
            setShowModal(true);
            setLoading(false);
        } catch (error) {
            console.error('Denetim kaydedilirken hata oluştu:', error);
            setModalMessage('Denetim kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
            setShowModal(true);
            setLoading(false);
        }
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
        setRefreshTrigger(prev => !prev); // Yeni denetim kaydedildiğinde listeyi yenilemek için tetikleyici
        setCurrentView('list');
    };

    return (
        <div className="denetim-formu-container p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Yeni Denetim Formu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {formData.map((madde, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">{madde.metin}</h3>
                        <div className="flex items-center space-x-4 mb-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={`durum-${index}`}
                                    value="Uygun"
                                    checked={madde.durum === 'Uygun'}
                                    onChange={() => handleInputChange(index, 'durum', 'Uygun')}
                                />
                                <span>Uygun</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={`durum-${index}`}
                                    value="Uygun Değil"
                                    checked={madde.durum === 'Uygun Değil'}
                                    onChange={() => handleInputChange(index, 'durum', 'Uygun Değil')}
                                />
                                <span>Uygun Değil</span>
                            </label>
                        </div>
                        {madde.durum === 'Uygun Değil' && (
                            <>
                                <textarea
                                    className="w-full p-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Not ekle..."
                                    value={madde.not}
                                    onChange={(e) => handleInputChange(index, 'not', e.target.value)}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="camera"
                                    className="w-full mt-2"
                                    onChange={(e) => handleFotoChange(index, e)}
                                />
                                {madde.foto && (
                                    <img src={madde.foto} alt="Denetim Fotoğrafı" className="mt-2 max-w-full h-auto rounded-lg shadow-md" />
                                )}
                            </>
                        )}
                    </div>
                ))}
                <div className="form-action-buttons">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Denetimi Kaydet'}
                    </button>
                </div>
            </form>
            <div className="form-action-buttons mt-4">
                <button onClick={() => setCurrentView('menu')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                    Ana Menüye Dön
                </button>
            </div>
            {showModal && <MessageModal message={modalMessage} onClose={closeModalAndNavigate} />}
        </div>
    );
};

export default DenetimFormu;
