import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profil from './pages/Profil'
import Anasayfa from './pages/Anasayfa'
import Magaza from './pages/Magaza'
import Giris from './pages/Giris'
import Kayit from './pages/Kayit'

function App() {
  const [sepet, setSepet] = useState([]); 
  const [sepetAcik, setSepetAcik] = useState(false);
  
  // --- KULLANICI YÖNETİMİ (AUTH STATE) ---
  const [kullanici, setKullanici] = useState(null); // Başlangıçta kimse yok (null)
  const navigate = useNavigate(); // Çıkış yapınca yönlendirmek için

  // 1. Sayfa ilk açıldığında: Daha önce giriş yapılmış mı kontrol et
  useEffect(() => {
    const kayitliKullanici = localStorage.getItem('kullanici');
    const kayitliToken = localStorage.getItem('token');
    
    if (kayitliKullanici && kayitliToken) {
      setKullanici(JSON.parse(kayitliKullanici)); // String'i tekrar objeye çevir
    }
  }, []);

  // 2. Giriş Yap Fonksiyonu (Giris.jsx kullanacak)
  function sistemeGiris(userBilgisi, token) {
    setKullanici(userBilgisi);
    // Tarayıcı hafızasına kaydet (Sayfa yenilenince gitmesin diye)
    localStorage.setItem('kullanici', JSON.stringify(userBilgisi));
    localStorage.setItem('token', token);
  }

  // 3. Çıkış Yap Fonksiyonu
  function cikisYap() {
    setKullanici(null);
    localStorage.removeItem('kullanici');
    localStorage.removeItem('token');
    toast.info("Güle güle! Yine bekleriz. 👋");
    navigate('/');
  }

  // --- SEPET FONKSİYONLARI ---
  function sepeteEkle(urun) {
    setSepet([...sepet, urun]);
    toast.success(`${urun.ad} yörüngeye eklendi! 🚀`, { icon: "🪐", theme: "dark" });
  }

  function sepettenCikar(indexNo) {
    const yeniSepet = [...sepet];
    yeniSepet.splice(indexNo, 1);
    setSepet(yeniSepet);
  }

  const toplamTutar = sepet.reduce((toplam, urun) => toplam + urun.fiyat, 0);

  // --- SİPARİŞİ TAMAMLAMA ---
  function siparisiTamamla() {
   // Siparişi Tamamla Fonksiyonu (App.jsx içine)
  const siparisiTamamla = () => {
    // 1. Sepet boşsa işlem yapma
    if (sepet.length === 0) {
        toast.error("Sepetiniz boş!");
        return;
    }

    // 2. Yükleniyor bildirimi göster
    const toastId = toast.loading("Sipariş oluşturuluyor...");

    // 3. Veriyi Taze Hazırla (Değişkeni burada oluşturuyoruz)
    const guncelSiparisVerisi = {
        musteri_ad: kullanici ? kullanici.ad : "Misafir Kullanıcı",
        toplam_tutar: toplamTutar(),
        sepet: sepet
    };

    console.log("Gönderilen Veri:", guncelSiparisVerisi); // Konsoldan kontrol edelim

    // 4. API'ye Gönder
    fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/siparis-ver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guncelSiparisVerisi) // Yeni oluşturduğumuz objeyi gönderiyoruz
    })
    .then(cevap => {
        if (!cevap.ok) throw new Error("Sunucu Hatası: " + cevap.status);
        return cevap.json();
    })
    .then(sonuc => {
      // Eğer veritabanı ID vermediyse hata var demektir
      if (!sonuc.siparisId) {
          throw new Error("Sipariş ID oluşmadı!");
      }

      toast.update(toastId, { render: `Sipariş Alındı! No: #${sonuc.siparisId} 🎉`, type: "success", isLoading: false, autoClose: 5000 });
      setSepet([]);      // Sepeti boşalt
      setSepetAcik(false); // Sepeti kapat
    })
    .catch(hata => {
      console.error("Sipariş hatası:", hata);
      toast.update(toastId, { render: "Sipariş kaydedilemedi! (Konsola bak)", type: "error", isLoading: false, autoClose: 3000 });
    });
  }; 
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', position: 'relative' }}>
      
      {/* --- NAVBAR --- */}
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Kullanıcı Giriş Durumuna Göre Değişen Butonlar */}
          {kullanici ? (
            <>
              <Link to="/profil" style={{ color: '#f39c12', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #f39c12', padding: '5px 15px', borderRadius: '20px', marginRight: '10px' }}>
                👨‍🚀 {kullanici.ad}
              </Link>
              <button onClick={cikisYap} style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>Çıkış</button>
            </>
          ) : (
            <Link to="/giris" style={{ background: '#f39c12', color: 'black', textDecoration: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold' }}>Giriş Yap</Link>
          )}

          <button 
            onClick={() => setSepetAcik(!sepetAcik)}
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 25px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s' }}>
            🛒 ({sepet.length})
          </button>
        </div>
      </div>

      {/* --- ROTALAR --- */}
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/magaza" element={<Magaza sepeteEkle={sepeteEkle} />} />
        <Route path="/profil" element={<Profil />} />
        {/* Giriş sayfasına "sistemeGiris" fonksiyonunu gönderiyoruz */}
        <Route path="/giris" element={<Giris girisYapFonksiyonu={sistemeGiris} />} />
        <Route path="/kayit" element={<Kayit />} />
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

          {sepet.length === 0 ? <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>Sepetiniz boş.</p> : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                {sepet.map((urun, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #333', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ fontWeight: 'bold' }}>{urun.ad}</div><div style={{ fontSize: '12px', color: '#aaa' }}>{urun.fiyat} TL</div></div>
                    <button onClick={() => sepettenCikar(index)} style={{ background: '#333', color: '#e74c3c', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}><i className="fas fa-trash"></i> Sil</button>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '20px', borderTop: '2px solid #333', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px' }}>
                    <span>Toplam:</span><span style={{ color: '#f39c12', fontWeight: 'bold' }}>{toplamTutar} TL</span>
                </div>
                <button 
                  onClick={siparisiTamamla}
                  style={{ width: '100%', padding: '15px', background: 'linear-gradient(45deg, #27ae60, #2ecc71)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Ödemeyi Tamamla 💳
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  )
}

export default App