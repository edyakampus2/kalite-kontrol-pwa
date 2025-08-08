// Tarih: 08.08.2025 Saat: 13:15
// src/components/Yedekleme.js

import React, { useState } from 'react';
import { getDenetimler as getDenetimlerFromIndexedDB, clearDenetimler as clearDenetimlerInIndexedDB, saveDenetim } from '../services/IndexedDBService';
import MessageModal from './MessageModal';

const Yedekleme = ({ setCurrentView }) => {
    // Bileşen içindeki yetkilendirme durumu
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Yedekleme işlemini yapan fonksiyon
    const handleYedekAl = async () => {
        setLoading(true);
        try {
            const denetimler = await getDenetimlerFromIndexedDB();
            const jsonString = JSON.stringify(denetimler, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `kalite-kontrol-yedeği-${new Date().toISOString()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setModalMessage("Yedek başarıyla indirildi.");
            setShowModal(true);
        } catch (error) {
            console.error("Yedekleme sırasında bir hata oluştu:", error);
            setModalMessage("Yedekleme sırasında bir hata oluştu.");
            setShowModal(true);
        }
        setLoading(false);
    };

    // Geri yükleme işlemini yapan fonksiyon
    const handleYedektenDon = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const denetimler = JSON.parse(e.target.result);
                // Mevcut verileri temizleme (isteğe bağlı, kullanıcıya sorulabilir)
                await clearDenetimlerInIndexedDB();
                for (const denetim of denetimler) {
                    await saveDenetim(denetim);
                }
                setModalMessage("Yedekten geri yükleme işlemi başarıyla tamamlandı.");
                setShowModal(true);
            } catch (error) {
                console.error("Geri yükleme sırasında bir hata oluştu:", error);
                setModalMessage("Geri yükleme sırasında bir hata oluştu. Lütfen dosyanın geçerli bir yedekleme dosyası olduğundan emin olun.");
                setShowModal(true);
            }
            setLoading(false);
        };
        reader.readAsText(file);
    };

    // Giriş işlemini kontrol eden fonksiyon
    const handleLogin = (e) => {
        e.preventDefault();
        // Basit bir doğrulama. Gerçek bir uygulamada bu bir API çağrısı olmalı.
        if (username === 'admin' && password === '12345') {
            setIsAuthorized(true);
            setModalMessage("Giriş başarılı!");
            setShowModal(true);
        } else {
            setModalMessage("Kullanıcı adı veya şifre yanlış.");
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 p-10 bg-gray-100 rounded-lg shadow-xl m-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Yedekleme ve Geri Yükleme</h2>
            {loading && <p>İşlem devam ediyor...</p>}
            
            {isAuthorized ? (
                // Eğer yetkili ise yedekleme butonlarını göster
                <>
                    <button
                        onClick={handleYedekAl}
                        className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 w-64 transform hover:scale-105"
                    >
                        Yedek Al
                    </button>
                    <label className="px-8 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300 w-64 transform hover:scale-105 cursor-pointer text-center">
                        Yedekten Dön
                        <input type="file" accept="application/json" onChange={handleYedektenDon} className="hidden" />
                    </label>
                </>
            ) : (
                // Yetkili değilse giriş formunu göster
                <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-64">
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="px-4 py-2 border rounded-full text-center"
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-2 border rounded-full text-center"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300 w-full transform hover:scale-105"
                    >
                        Giriş Yap
                    </button>
                </form>
            )}
            
            <div className="form-action-buttons">
                <button onClick={() => setCurrentView('menu')}>Ana Menüye Dön</button>
            </div>
            {showModal && <MessageModal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default Yedekleme;
