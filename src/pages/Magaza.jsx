import { useState, useEffect } from 'react'

// --- ÜRÜN KARTI BİLEŞENİ ---
function UrunKarti(props) {
  return (
    <div style={{ 
      border: '1px solid #444', borderRadius: '15px', padding: '20px', 
      backgroundColor: '#222', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
    }}>
      <div>
        <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>{props.veri.ad}</h3>
        {/* Veritabanında sütun adı 'aciklama' olduğu için burayı düzelttik */}
        <p style={{ color: '#aaa', fontSize: '14px' }}>
            {props.veri.aciklama ? props.veri.aciklama.substring(0, 50) + '...' : 'Açıklama yok'}
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '18px' }}>
            {props.veri.fiyat} TL
        </span>
        <button 
            onClick={() => props.sepeteAt(props.veri)} 
            style={{ background: '#f39c12', color: 'black', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ekle
        </button>
      </div>
    </div>
  )
}

function Magaza({ sepeteEkle }) { 
  // 1. Ürünleri tutacak boş bir liste (State) oluşturuyoruz
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true); // Yükleniyor animasyonu için

  // 2. Sayfa açılınca Node.js'ten verileri çek (useEffect)
  useEffect(() => {
    fetch('http://localhost:3000/api/urunler') // API Adresi
      .then(cevap => cevap.json()) // Gelen veriyi JSON'a çevir
      .then(veri => {
        setUrunler(veri); // State'i güncelle
        setYukleniyor(false); // Yükleme bitti
      })
      .catch(hata => {
        console.error("Veri çekme hatası:", hata);
        setYukleniyor(false);
      });
  }, []); // Sondaki [] sayesinde bu işlem sadece sayfa ilk açıldığında 1 kere yapılır.

  return (
    <div>
      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        Gerçek Ürün Kataloğu (MySQL)
      </h2>

      {/* Eğer yükleniyorsa mesaj göster */}
      {yukleniyor && <p style={{color: 'yellow'}}>Veriler Evrenden İndiriliyor...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {urunler.map((urun) => (
          <UrunKarti key={urun.id} veri={urun} sepeteAt={sepeteEkle} />
        ))}
      </div>
    </div>
  )
}

export default Magaza;