import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom' // Yönlendirme araçları
import Anasayfa from './pages/Anasayfa'
import Magaza from './pages/Magaza'

function App() {
  const [sepet, setSepet] = useState([]); 
  const [sepetAcik, setSepetAcik] = useState(false);

  function sepeteEkle(urun) {
    setSepet([...sepet, urun]);
  }

  function sepettenCikar(indexNo) {
    const yeniSepet = [...sepet];
    yeniSepet.splice(indexNo, 1);
    setSepet(yeniSepet);
  }

  const toplamTutar = sepet.reduce((toplam, urun) => toplam + urun.fiyat, 0);

  return (
    <div style={{ minHeight: '100vh', padding: '20px', position: 'relative' }}>
      
      {/* --- SABİT MENÜ (NAVBAR) --- */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', padding: '10px 30px', backgroundColor: '#222', borderRadius: '15px' 
      }}>
        {/* Logo ve Linkler */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 style={{ margin: 0 }}>🪐 Evren v2</h2>
          <nav>
            {/* Link etiketi, sayfa yenilenmeden geçiş sağlar */}
            <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Ana Sayfa</Link>
            <Link to="/magaza" style={{ color: 'white', textDecoration: 'none' }}>Mağaza</Link>
          </nav>
        </div>
        
        {/* Sepet Butonu */}
        <button 
          onClick={() => setSepetAcik(!sepetAcik)}
          style={{ background: '#333', color: 'white', border: '1px solid #555', padding: '10px 25px', borderRadius: '30px', cursor: 'pointer' }}>
          🛒 Sepet ({sepet.length})
        </button>
      </div>

      {/* --- DEĞİŞEN İÇERİK ALANI (ROUTES) --- */}
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        {/* Mağaza sayfasına sepeteEkle fonksiyonunu hediye olarak gönderiyoruz (Props) */}
        <Route path="/magaza" element={<Magaza sepeteEkle={sepeteEkle} />} />
      </Routes>

      {/* --- SEPET PENCERESİ (Her sayfada çalışır) --- */}
      {sepetAcik && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '350px', height: '100%',
          backgroundColor: '#1a1a1a', borderLeft: '2px solid #333', boxShadow: '-5px 0 15px black',
          padding: '20px', overflowY: 'auto', zIndex: 999
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Sepetiniz</h2>
            <button onClick={() => setSepetAcik(false)} style={{ background: 'transparent', border: 'none', color: 'red', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          </div>
          {sepet.length === 0 ? <p style={{ color: '#777' }}>Sepet boş...</p> : (
            <>
              {sepet.map((urun, index) => (
                <div key={index} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <div><div>{urun.ad}</div><div style={{ fontSize: '12px', color: '#aaa' }}>{urun.fiyat} TL</div></div>
                  <button onClick={() => sepettenCikar(index)} style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Sil</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', borderTop: '2px solid #444', paddingTop: '15px' }}>
                <h3>Toplam: <span style={{ color: '#f39c12' }}>{toplamTutar} TL</span></h3>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}

export default App