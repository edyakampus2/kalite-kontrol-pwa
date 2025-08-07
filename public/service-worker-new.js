// public/service-worker-new.js

const CACHE_NAME = 'kalite-kontrol-cache-final-v5'; // Yeni versiyon için önbellek adını güncelledik

self.addEventListener('install', event => {
  console.log('Service Worker kuruluyor... Final sürüm 5.');
  // Yeni service worker'ı hemen etkinleştir
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Yalnızca GET isteklerini ele al
  if (event.request.method !== 'GET') {
    return;
  }

  // Önbellekten yanıt almayı dene
  event.respondWith(
    caches.match(event.request).then(response => {
      // Önbellekte varsa döndür
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

        const responseToCache = response.clone();
        
        // Yanıtı klonla ve önbelleğe al
        caches.open(CACHE_NAME).then(cache => {
          // CSS, JS ve diğer gerekli dosyaları dinamik olarak önbelleğe al
          const url = new URL(event.request.url);
          const fileExtension = url.pathname.split('.').pop();
          
          // `static` klasöründeki CSS ve JS dosyaları ve ana HTML dosyalarını önbelleğe al
          if (
            url.pathname.startsWith('/static/') || 
            url.pathname === '/' || 
            url.pathname === '/index.html' || 
            url.pathname === '/manifest.json'
          ) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      });
    }).catch(error => {
      console.error('Fetch hatası:', error);
      // Ağ hatasında önbellekten dosya döndürmeyi dene
      return caches.match('/');
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker etkinleştiriliyor... Final sürüm 5.');
  // Eski client'ların yeni service worker'ı kullanmasını sağla
  event.waitUntil(self.clients.claim());

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
