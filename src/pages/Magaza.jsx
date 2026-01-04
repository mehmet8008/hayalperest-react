import { useState, useEffect } from 'react'

// --- ÜRÜN KARTI ---
function UrunKarti(props) {
  return (
    <div className="urun-karti" style={{ 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px', 
      padding: '25px', 
      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(10px)',
      textAlign: 'left', 
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)', height: '100%'
    }}>
      <div>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
        <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '24px' }}>{props.veri.ad}</h3>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.4' }}>
            {props.veri.aciklama ? props.veri.aciklama.substring(0, 80) + '...' : 'Özel üretim parçası.'}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <span style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '22px', textShadow: '0 0 10px rgba(243,156,18,0.3)' }}>
            {props.veri.fiyat} ₺
        </span>
        <button 
            onClick={() => props.sepeteAt(props.veri)} 
            style={{ 
                background: 'white', color: 'black', border: 'none', 
                padding: '10px 25px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
                transition: 'background 0.3s'
            }}>
          EKLE +
        </button>
      </div>
    </div>
  )
}

function Magaza({ sepeteEkle }) { 
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]); // Kategoriler için hafıza
  const [seciliKategori, setSeciliKategori] = useState(null); // Şu an hangi kategori seçili?
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aramaMetni, setAramaMetni] = useState(""); 

  // 1. Sayfa Açılınca Hem Ürünleri Hem Kategorileri Çek
  useEffect(() => {
    tumUrunleriGetir();
    kategorileriGetir();
  }, []);

  const tumUrunleriGetir = () => {
    setYukleniyor(true);
    fetch('https://hayalperest-api-pro-v1.onrender.com/api/urunler')
      .then(cevap => cevap.json())
      .then(veri => {
        setUrunler(veri);
        setYukleniyor(false);
      });
  };

  const kategorileriGetir = () => {
    fetch('https://hayalperest-api-pro-v1.onrender.com/api/kategoriler')
      .then(cevap => cevap.json())
      .then(veri => setKategoriler(veri));
  };

  // 2. Kategoriye Tıklanınca Çalışacak Fonksiyon
  const kategoriSec = (katId) => {
    setSeciliKategori(katId);
    setYukleniyor(true);

    if (katId === null) {
      // "Tümü" seçildiyse hepsini getir
      tumUrunleriGetir();
    } else {
      // Belirli kategori seçildiyse API'den filtreli iste
      fetch(`https://hayalperest-api-pro-v1.onrender.com/api/urunler/kategori/${katId}`)
        .then(cevap => cevap.json())
        .then(veri => {
            setUrunler(veri);
            setYukleniyor(false);
        });
    }
  };

  // Arama Filtresi (Mevcut ürünler içinde arama yapar)
  const filtrelenmisUrunler = urunler.filter(urun => {
    return urun.ad.toLowerCase().includes(aramaMetni.toLowerCase());
  });

  return (
    <div>
      {/* BAŞLIK VE ARAMA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <h2 style={{ fontSize: '30px', letterSpacing: '2px', margin: 0 }}>MAGAZA</h2>
        <input 
          type="text" 
          placeholder="Evrende ara..." 
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
          style={{ padding: '15px 25px', fontSize: '16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none', width: '300px' }}
        />
      </div>

      {/* --- KATEGORİ BUTONLARI --- */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '10px' }}>
        {/* "Tümü" Butonu */}
        <button 
          onClick={() => kategoriSec(null)}
          style={{
            padding: '10px 25px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            // Eğer seçili kategori null ise Rengi Turuncu yap, değilse Şeffaf yap
            backgroundColor: seciliKategori === null ? '#f39c12' : 'rgba(255,255,255,0.1)',
            color: seciliKategori === null ? 'black' : 'white',
            transition: 'all 0.3s'
          }}>
          Tümü
        </button>

        {/* Veritabanından Gelen Kategoriler */}
        {kategoriler.map(kat => (
          <button 
            key={kat.id}
            onClick={() => kategoriSec(kat.id)}
            style={{
              padding: '10px 25px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              // Seçili kategori bu ise Rengi Turuncu yap
              backgroundColor: seciliKategori === kat.id ? '#f39c12' : 'rgba(255,255,255,0.1)',
              color: seciliKategori === kat.id ? 'black' : 'white',
              transition: 'all 0.3s'
            }}>
            {kat.ad}
          </button>
        ))}
      </div>

      {yukleniyor && <div style={{ textAlign: 'center', padding: '50px', color: '#f39c12' }}>📡 Veriler Yükleniyor...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '10px' }}>
        {filtrelenmisUrunler.map((urun) => (
          <UrunKarti key={urun.id} veri={urun} sepeteAt={sepeteEkle} />
        ))}
      </div>
    </div>
  )
}

export default Magaza;