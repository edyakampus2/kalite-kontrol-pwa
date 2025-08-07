// public/service-worker-new.js

const CACHE_NAME = 'kalite-kontrol-cache-final-v3'; // Yeni versiyon için önbellek adını güncelledik

self.addEventListener('install', event => {
  console.log('Service Worker kuruluyor... Final sürüm 3.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Uygulamanın en temel statik dosyalarını önbelleğe al
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        // Buraya PWA'nın ana dosyalarını ekleyin
        // Örnek: logo, ikonlar, vb.
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  // Yalnızca GET isteklerini ele al
  if (event.request.method !== 'GET') {
    return;
  }

  // Dinamik olarak önbellekleme
  event.respondWith(
    caches.match(event.request).then(response => {
      // Önbellekte varsa doğrudan döndür
      if (response) {
        return response;
      }

      // Önbellekte yoksa ağdan çek
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        // Geçerli bir yanıt gelmezse veya ağ hatası olursa geri dön
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Yanıtı klonla, çünkü yanıt akışları yalnızca bir kez okunabilir
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          // CSS ve JS dosyalarını dinamik olarak önbelleğe al
          const url = new URL(event.request.url);
          const isCss = url.pathname.endsWith('.css');
          const isJs = url.pathname.endsWith('.js');
          
          // `static` klasöründeki tüm CSS ve JS dosyalarını önbelleğe al
          if (url.pathname.startsWith('/static/') && (isCss || isJs)) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
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
