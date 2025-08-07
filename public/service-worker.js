// public/service-worker.js

const CACHE_NAME = 'kalite-kontrol-cache-v3'; // Önbellek adını güncelledik
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css', // CSS dosyası
  '/static/js/main.chunk.js', // Ana JS dosyası
  '/static/js/0.chunk.js', // Eğer varsa diğer JS dosyası
  // Diğer statik dosyaları (img, font vb.) buraya ekleyebilirsin
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbelleğe alma işlemi tamamlandı. v2');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Önbelleğe alma işleminde hata oluştu:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // Yalnızca GET isteklerini ele al
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Önbellekte varsa doğrudan önbellekten döndür
          return response;
        }
        
        // Önbellekte yoksa ağdan çek
        return fetch(event.request)
          .then(res => {
            // Ağdan çekilen dosyaları önbelleğe ekle
            return caches.open(CACHE_NAME)
              .then(cache => {
                // Sadece başarılı yanıtları önbelleğe al
                if (res.status === 200) {
                  cache.put(event.request, res.clone());
                }
                return res;
              });
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
