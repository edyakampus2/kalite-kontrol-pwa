const DB_NAME = 'KaliteKontrolDB';
const DB_VERSION = 1;
const STORE_NAME = 'denetimler';

let db = null;

const openDB = () => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error: ' + event.target.errorCode);
            reject('Database error: ' + event.target.errorCode);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
};

export const saveDenetim = async (denetim) => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(denetim);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error('Save error: ' + event.target.errorCode);
            reject('Save error: ' + event.target.errorCode);
        };
    });
};

export const getDenetimler = async () => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error('Get error: ' + event.target.errorCode);
            reject('Get error: ' + event.target.errorCode);
        };
    });
};

export const clearDenetimler = async () => {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            console.error('Clear error: ' + event.target.errorCode);
            reject('Clear error: ' + event.target.errorCode);
        };
    });
};