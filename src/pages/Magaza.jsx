import { useState, useEffect } from 'react'

function UrunKarti(props) {
  return (
    <div className="urun-karti" style={{ 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px', padding: '25px', 
      backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
      textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
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
  // Başlangıçta boş dizi ([]) olduğundan emin oluyoruz
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [seciliKategori, setSeciliKategori] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aramaMetni, setAramaMetni] = useState(""); 
  const [hataMesaji, setHataMesaji] = useState(null); // Hata göstermek için

  useEffect(() => {
    tumUrunleriGetir();
    kategorileriGetir();
  }, []);

  const tumUrunleriGetir = () => {
    setYukleniyor(true);
    // Buradaki URL'in Render URL'i olduğundan emin ol (sonunda / olmasın)
    fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/urunler')
      .then(cevap => {
        if (!cevap.ok) throw new Error("Sunucu hatası: " + cevap.status);
        return cevap.json();
      })
      .then(veri => {
        console.log("Gelen Ürünler:", veri); // Konsolda ne geldiğini görelim
        // ÖNEMLİ KONTROL: Gelen veri bir liste mi?
        if (Array.isArray(veri)) {
            setUrunler(veri);
            setHataMesaji(null);
        } else {
            console.error("API'den liste gelmedi:", veri);
            setHataMesaji("Veriler hatalı formatta geldi.");
            setUrunler([]); // Çökmemesi için boş liste ata
        }
        setYukleniyor(false);
      })
      .catch(hata => {
        console.error("Fetch Hatası:", hata);
        setHataMesaji("Sunucuya bağlanılamadı. Render uyanıyor olabilir.");
        setYukleniyor(false);
        setUrunler([]);
      });
  };

  const kategorileriGetir = () => {
    fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/kategoriler')
      .then(cevap => cevap.json())
      .then(veri => {
          if(Array.isArray(veri)) setKategoriler(veri);
          else setKategoriler([]);
      })
      .catch(err => console.log("Kategori hatası", err));
  };

  const kategoriSec = (katId) => {
    setSeciliKategori(katId);
    setYukleniyor(true);

    const url = katId === null 
        ? 'https://hayalperest-api-mehmet-2026-v99.onrender.com/api/urunler'
        : `https://hayalperest-api-mehmet-2026-v99.onrender.com/api/urunler/kategori/${katId}`;

    fetch(url)
        .then(cevap => cevap.json())
        .then(veri => {
            if (Array.isArray(veri)) setUrunler(veri);
            else setUrunler([]);
            setYukleniyor(false);
        })
        .catch(err => {
            console.error(err);
            setYukleniyor(false);
        });
  };

  // Filtreleme yaparken urunler'in dizi olduğundan emin oluyoruz
  const filtrelenmisUrunler = Array.isArray(urunler) 
    ? urunler.filter(urun => urun.ad.toLowerCase().includes(aramaMetni.toLowerCase()))
    : [];

  return (
    <div>
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

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '10px' }}>
        <button 
          onClick={() => kategoriSec(null)}
          style={{
            padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            backgroundColor: seciliKategori === null ? '#f39c12' : 'rgba(255,255,255,0.1)',
            color: seciliKategori === null ? 'black' : 'white', transition: 'all 0.3s'
          }}>
          Tümü
        </button>
        {kategoriler.map(kat => (
          <button 
            key={kat.id} onClick={() => kategoriSec(kat.id)}
            style={{
              padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: seciliKategori === kat.id ? '#f39c12' : 'rgba(255,255,255,0.1)',
              color: seciliKategori === kat.id ? 'black' : 'white', transition: 'all 0.3s'
            }}>
            {kat.ad}
          </button>
        ))}
      </div>

      {/* HATA MESAJI VARSA GÖSTER */}
      {hataMesaji && (
        <div style={{ padding: '20px', backgroundColor: 'rgba(231, 76, 60, 0.2)', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e74c3c' }}>
            ⚠️ {hataMesaji} <br/> 
            <small>Render sunucusu uyanıyor olabilir, 30sn sonra sayfayı yenileyin.</small>
        </div>
      )}

      {yukleniyor && <div style={{ textAlign: 'center', padding: '50px', color: '#f39c12' }}>📡 Veriler Yükleniyor...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '10px' }}>
        {filtrelenmisUrunler.length > 0 ? (
            filtrelenmisUrunler.map((urun) => (
            <UrunKarti key={urun.id} veri={urun} sepeteAt={sepeteEkle} />
            ))
        ) : (
            !yukleniyor && !hataMesaji && <p>Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  )
}

export default Magaza;