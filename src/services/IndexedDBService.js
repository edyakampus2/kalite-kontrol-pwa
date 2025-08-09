// src/services/IndexedDBService.js
// Tarih: 09.08.2025 Saat: 14:20
// Açıklama: Denetim verilerini IndexedDB kullanarak yerel olarak saklama ve çekme işlevlerini sağlar.

import { openDB } from 'idb';

const DB_NAME = 'kaliteKontrolDB';
const DB_VERSION = 1;
const STORE_NAME = 'denetimler';

const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const saveDenetim = async (denetim) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.add(denetim);
    await tx.done;
    console.log('Denetim IndexedDB\'ye kaydedildi.');
};

export const getDenetimler = async () => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const clearDenetimler = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
    console.log('IndexedDB temizlendi.');
};
