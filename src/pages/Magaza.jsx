import { useState, useEffect } from 'react'

// --- ÜRÜN KARTI (Burası Aynı) ---
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
  const [yukleniyor, setYukleniyor] = useState(true);
  
  // 1. YENİ STATE: Arama kutusuna yazılan metin
  const [aramaMetni, setAramaMetni] = useState(""); 

  useEffect(() => {
    fetch('http://localhost:3000/api/urunler')
      .then(cevap => cevap.json())
      .then(veri => {
        setUrunler(veri);
        setYukleniyor(false);
      })
      .catch(hata => {
        console.error("Hata:", hata);
        setYukleniyor(false);
      });
  }, []);

  // 2. FİLTRELEME MANTIĞI (En önemli kısım)
  // Ürünleri tek tek kontrol et. Eğer adı, arama metnini içeriyorsa listeye al.
  const filtrelenmisUrunler = urunler.filter(urun => {
    // Hem ürün adını hem aranan kelimeyi küçük harfe çevir (Büyük/küçük harf duyarlılığını kaldır)
    return urun.ad.toLowerCase().includes(aramaMetni.toLowerCase());
  });

  return (
    <div>
      {/* Üst Kısım: Başlık ve Arama Kutusu Yan Yana */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #333', 
          paddingBottom: '20px', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
      }}>
        <h2 style={{ fontSize: '30px', letterSpacing: '2px', margin: 0 }}>
          MAGAZA ENVANTERİ
        </h2>

        {/* 3. ARAMA INPUTU (SEARCH BAR) */}
        <input 
          type="text" 
          placeholder="Evrende ürün ara..." 
          value={aramaMetni}
          // Her tuşa basıldığında (onChange) state'i güncelle
          onChange={(e) => setAramaMetni(e.target.value)}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.1)', // Şeffaf arka plan
            color: 'white',
            outline: 'none',
            width: '300px',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s'
          }}
          // Odaklanınca (Focus) parlasın
          onFocus={(e) => e.target.style.borderColor = '#f39c12'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
      </div>

      {yukleniyor && (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '24px', color: '#f39c12' }}>
           📡 Evrenden Veri İndiriliyor...
        </div>
      )}

      {/* 4. SONUÇ YOKSA UYARI VER */}
      {!yukleniyor && filtrelenmisUrunler.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
              <h3>🪐 Aradığınız kriterlere uygun ürün bulunamadı.</h3>
              <p>Belki de henüz icat edilmemiştir?</p>
          </div>
      )}

      {/* 5. ARTIK 'urunler' DEĞİL 'filtrelenmisUrunler' DÖNÜYORUZ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {filtrelenmisUrunler.map((urun) => (
          <UrunKarti key={urun.id} veri={urun} sepeteAt={sepeteEkle} />
        ))}
      </div>
    </div>
  )
}

export default Magaza;