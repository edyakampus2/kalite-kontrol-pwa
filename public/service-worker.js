// public/service-worker.js
// Tarih: 08.08.2025 Saat: 18:45
// Açıklama: Önbelleğe alma hatasını gidermek için statik dosya listesi güncellendi.

// Önbellek adını, yeni bir sürüm olduğunu belirtmek için her güncellemede değiştirin
const CACHE_NAME = 'kalite-kontrol-cache-v4'; 

// Sadece derleme sırasında adı değişmeyecek dosyaları listeye ekleyin.
// CSS ve JS dosyaları genellikle derleme hash'i içerdiği için buraya eklenmemelidir.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Eğer uygulamanızda sabit yollara sahip resimler veya fontlar varsa buraya ekleyebilirsiniz.
  // Örneğin: '/images/logo.png', '/fonts/my-font.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbelleğe alma işlemi başladı. v4');
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('Ön-önbellekleme başarılı.');
          })
          .catch(error => {
            console.error('Ön-önbellekleme sırasında hata oluştu. Bazı dosyalar bulunamadı:', error);
            // Hata olsa bile install işleminin devam etmesi için Promise'i çözüyoruz.
            // Diğer dosyalar fetch event'i sırasında önbelleğe alınacaktır.
          });
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
        // Önbellekte varsa doğrudan önbellekten döndür
        if (response) {
          return response;
        }
        
        // Önbellekte yoksa ağdan çek
        return fetch(event.request)
          .then(res => {
            // Ağdan çekilen dosyaları önbelleğe ekle
            // Başarısız yanıtları (örneğin 404, 500) önbelleğe almıyoruz
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            // Başarılı yanıtı önbelleğe almak için clone() kullan
            const responseToCache = res.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return res;
          });
      })
      .catch(() => {
        // İnternet bağlantısı yoksa ve önbellekte de dosya yoksa, kullanıcıya özel bir çevrimdışı sayfası gösterilebilir.
        // Örneğin: return caches.match('/offline.html');
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
