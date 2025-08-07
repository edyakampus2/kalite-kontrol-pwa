// public/service-worker-new.js

const CACHE_NAME = 'kalite-kontrol-cache-final';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Tailwind CSS için gerekli olan dosya. Proje build edildiğinde doğru yolu bulacaktır.
  '/static/css/main.css', 
  // Ana JS dosyaları. Build edildiğinde isimleri değişebilir.
  // Bu nedenle wildcards (joker karakter) kullanmak daha güvenli olabilir.
  '/static/js/*.js', 
  '/static/js/*.chunk.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbelleğe alma işlemi tamamlandı. Final sürüm.');
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
