import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Sayfalar
import Anasayfa from './pages/Anasayfa'
import Magaza from './pages/Magaza'
import Giris from './pages/Giris'
import Kayit from './pages/Kayit'
import Profil from './pages/Profil'

function App() {
  const [sepet, setSepet] = useState([]);
  const [sepetAcik, setSepetAcik] = useState(false);
  const [kullanici, setKullanici] = useState(null);
  const navigate = useNavigate();

  // 1. Uygulama açılınca kullanıcıyı hatırla
  useEffect(() => {
    try {
        const kayitliKullanici = localStorage.getItem('kullanici');
        if (kayitliKullanici) {
            setKullanici(JSON.parse(kayitliKullanici));
        }
    } catch (error) {
        console.log("Gizlilik ayarları nedeniyle hafıza okunamadı.");
    }
  }, []);

  // 2. Sepete Ekleme Fonksiyonu
  const sepeteEkle = (urun) => {
    setSepet([...sepet, urun]);
    toast.success(`${urun.ad} sepete eklendi! 🚀`);
  };

  // 3. Sepetten Çıkarma Fonksiyonu
  const sepettenCikar = (index) => {
    const yeniSepet = [...sepet];
    yeniSepet.splice(index, 1);
    setSepet(yeniSepet);
  };

  // 4. TOPLAM TUTAR HESAPLAMA (DÜZELTİLEN KISIM) 🧮
  // reduce ile dönerken "parseFloat" kullanarak metni sayıya çeviriyoruz.
  const toplamTutar = sepet.reduce((toplam, urun) => {
    return toplam + parseFloat(urun.fiyat);
  }, 0).toFixed(2); // Sonucu virgülden sonra 2 hane (1300.00) yap.

  // 5. SİPARİŞ VERME FONKSİYONU (DÜZELTİLEN KISIM) 🛒
  const siparisiTamamla = () => {
    if (sepet.length === 0) {
        toast.error("Sepetiniz boş, uzay boşluğu kadar boş! 🌌");
        return;
    }

    const toastId = toast.loading("Sipariş işleniyor...");

    // Veriyi hazırla (Giriş yapmamışsa Misafir yaz)
    const siparisVerisi = {
        musteri_ad: kullanici ? kullanici.ad : "Misafir Gezgin",
        toplam_tutar: toplamTutar, // Hesaplanan sayıyı gönderiyoruz
        sepet: sepet
    };

    console.log("Backend'e giden veri:", siparisVerisi);

    fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/siparis-ver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siparisVerisi)
    })
    .then(cevap => cevap.json())
    .then(sonuc => {
      // Backend siparisId gönderiyor mu kontrol et
      if (sonuc.siparisId) {
        toast.update(toastId, { render: `Sipariş Alındı! No: #${sonuc.siparisId} 🎉`, type: "success", isLoading: false, autoClose: 5000 });
        setSepet([]); // Sepeti temizle
        setSepetAcik(false); // Sepeti kapat
      } else {
        throw new Error("Sipariş numarası oluşmadı.");
      }
    })
    .catch(hata => {
      console.error("Sipariş Hatası:", hata);
      toast.update(toastId, { render: "Sipariş verilemedi! Bir sorun var.", type: "error", isLoading: false, autoClose: 3000 });
    });
  };

  // 6. Çıkış Yap
  const cikisYap = () => {
    setKullanici(null);
    localStorage.removeItem('kullanici');
    localStorage.removeItem('token');
    toast.info("Çıkış yapıldı, yine bekleriz Kaptan! 👋");
    navigate('/');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight: '100vh', backgroundColor: '#0b0c10', color: '#c5c6c7' }}>
      <ToastContainer position="bottom-right" theme="dark" />

      {/* --- NAVBAR --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', backgroundColor: '#1f2833', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#66fcf1', letterSpacing: '2px' }}>
            HAYAL<span style={{ color: '#fff' }}>PEREST</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>Ana Sayfa</Link>
            <Link to="/magaza" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>Mağaza</Link>
            
            {kullanici ? (
                <>
                    <Link to="/profil" style={{ color: '#45a29e', textDecoration: 'none', fontWeight: 'bold' }}>{kullanici.ad}</Link>
                    <button onClick={cikisYap} style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>Çıkış</button>
                </>
            ) : (
                <Link to="/giris" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>Giriş / Kayıt</Link>
            )}

            <button onClick={() => setSepetAcik(true)} style={{ position: 'relative', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>
                🛒
                {sepet.length > 0 && (
                    <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e74c3c', color: 'white', fontSize: '12px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {sepet.length}
                    </span>
                )}
            </button>
        </div>
      </nav>

      {/* --- SAYFA İÇERİĞİ --- */}
      <div style={{ padding: '40px' }}>
        <Routes>
            <Route path="/" element={<Anasayfa />} />
            <Route path="/magaza" element={<Magaza sepeteEkle={sepeteEkle} />} />
            <Route path="/giris" element={<Giris setKullanici={setKullanici} />} />
            <Route path="/kayit" element={<Kayit />} />
            <Route path="/profil" element={<Profil kullanici={kullanici} />} />
        </Routes>
      </div>

      {/* --- SEPET MODAL (Açılır Pencere) --- */}
      {sepetAcik && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '400px', height: '100%', backgroundColor: '#1f2833', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <h2 style={{ color: '#fff', margin: 0 }}>Sepetim 📦</h2>
                    <button onClick={() => setSepetAcik(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {sepet.length === 0 ? (
                        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>Sepetin boş kaptan.</p>
                    ) : (
                        sepet.map((