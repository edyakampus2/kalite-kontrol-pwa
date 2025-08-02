// public/service-worker.js

const CACHE_NAME = 'kalite-kontrol-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Projenin diğer statik dosyalarını buraya ekleyebilirsin
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbelleğe alma işlemi tamamlandı.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});