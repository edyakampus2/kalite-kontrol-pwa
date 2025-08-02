// src/services/IndexedDBService.js

import { openDB } from 'idb';

const DB_NAME = 'kaliteKontrolDB';
const STORE_NAME = 'denetimler';

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        },
    });
};

// Yeni bir denetim kaydı ekler
export const saveDenetim = async (denetim) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.add(denetim);
    await tx.done;
};

// Kaydedilen tüm denetimleri getirir
export const getDenetimler = async () => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

// Belirli bir denetimi ID'sine göre siler
export const deleteDenetim = async (id) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
};

// Tüm denetimleri siler
export const clearDenetimler = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
};