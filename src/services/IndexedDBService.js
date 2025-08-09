// Tarih: 2025-08-08
// Kod Grup Açıklaması: IndexedDB Servisi (Mock)
// 'IndexedDBService' için mock implementasyon
// Ayrı bir dosya gibi davranması için burada tanımlanmıştır.
export const getDenetimler = async () => {
  console.log("IndexedDB'den denetimler alınıyor (Mock)...");
  return [
    {
      id: 1,
      tarih: new Date().toISOString(),
      formData: [{ durum: 'Uygun Değil' }],
      kontrolListesi: [{ metin: "Kontrol 1", durum: "Uygun Değil", not: "Hata notu" }]
    },
    {
      id: 2,
      tarih: new Date().toISOString(),
      formData: [{ durum: 'Uygun' }],
      kontrolListesi: [{ metin: "Kontrol 2", durum: "Uygun" }]
    }
  ];
};
