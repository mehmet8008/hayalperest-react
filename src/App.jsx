import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Anasayfa from './pages/Anasayfa'
import Magaza from './pages/Magaza'

function App() {
  const [sepet, setSepet] = useState([]); 
  const [sepetAcik, setSepetAcik] = useState(false);

  // Sepete Ekleme
  function sepeteEkle(urun) {
    setSepet([...sepet, urun]);
    toast.success(`${urun.ad} yörüngeye eklendi! 🚀`, {
      icon: "🪐",
      theme: "dark"
    });
  }

  // Sepetten Çıkarma
  function sepettenCikar(indexNo) {
    const yeniSepet = [...sepet];
    const silinenUrun = yeniSepet[indexNo];
    yeniSepet.splice(indexNo, 1);
    setSepet(yeniSepet);
    toast.error(`${silinenUrun.ad} boşluğa bırakıldı. 🗑️`, { theme: "dark" });
  }

  const toplamTutar = sepet.reduce((toplam, urun) => toplam + urun.fiyat, 0);

  // --- SİPARİŞİ TAMAMLAMA (Backend'e Gönderme) ---
  function siparisiTamamla() {
    if(sepet.length === 0) return;

    const siparisVerisi = {
      musteri_ad: "Misafir React Kullanıcısı", // İleride burası dinamik olacak
      toplam_tutar: toplamTutar,
      sepet: sepet
    };

    // Yükleniyor mesajı verelim
    const toastId = toast.loading("Sipariş merkeze iletiliyor...");

    fetch('http://localhost:3000/api/siparis-ver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siparisVerisi)
    })
    .then(cevap => cevap.json())
    .then(sonuc => {
      // Yükleniyor mesajını sil, başarı mesajı göster
      toast.update(toastId, { render: `Sipariş Alındı! No: #${sonuc.siparisId} 🎉`, type: "success", isLoading: false, autoClose: 5000 });
      
      setSepet([]); // Sepeti boşalt
      setSepetAcik(false); // Pencereyi kapat
    })
    .catch(hata => {
      console.error("Sipariş hatası:", hata);
      toast.update(toastId, { render: "Bir sorun oluştu!", type: "error", isLoading: false, autoClose: 3000 });
    });
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', position: 'relative' }}>
      
      {/* --- MENÜ (NAVBAR) --- */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', padding: '15px 30px', backgroundColor: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(10px)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>🪐 Evren v2</h2>
          <nav>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>Ana Sayfa</Link>
            <Link to="/magaza" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Mağaza</Link>
          </nav>
        </div>
        
        <button 
          onClick={() => setSepetAcik(!sepetAcik)}
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 25px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s' }}>
          🛒 Sepet ({sepet.length})
        </button>
      </div>

      {/* --- SAYFALAR --- */}
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/magaza" element={<Magaza sepeteEkle={sepeteEkle} />} />
      </Routes>

      {/* --- SEPET PENCERESİ --- */}
      {sepetAcik && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '350px', height: '100%',
          backgroundColor: '#111', borderLeft: '1px solid #333', boxShadow: '-10px 0 30px black',
          padding: '20px', overflowY: 'auto', zIndex: 9999, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            <h2>Sepetiniz</h2>
            <button onClick={() => setSepetAcik(false)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', fontSize: '24px', cursor: 'pointer' }}>✖</button>
          </div>

          {sepet.length === 0 ? <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>Sepetinizde henüz ürün yok.</p> : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                {sepet.map((urun, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #333', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{urun.ad}</div>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{urun.fiyat} TL</div>
                    </div>
                    <button onClick={() => sepettenCikar(index)} style={{ background: '#333', color: '#e74c3c', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}><i className="fas fa-trash"></i> Sil</button>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '20px', borderTop: '2px solid #333', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px' }}>
                    <span>Toplam:</span>
                    <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{toplamTutar} TL</span>
                </div>
                
                {/* İŞTE GÜNCELLENEN BUTON BURADA */}
                <button 
                  onClick={siparisiTamamla}
                  style={{ 
                      width: '100%', padding: '15px', 
                      background: 'linear-gradient(45deg, #27ae60, #2ecc71)', 
                      color: 'white', border: 'none', borderRadius: '10px', 
                      fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', 
                      boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)',
                      transition: 'transform 0.2s'
                  }}
                  onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Ödemeyi Tamamla 💳
                </button>

              </div>
            </div>
          )}
        </div>
      )}

      {/* --- BİLDİRİM KUTUSU --- */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

    </div>
  )
}

export default App