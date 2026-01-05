import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profil() {
  const [siparisler, setSiparisler] = useState([]);
  const [kullanici, setKullanici] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Önce giriş yapılmış mı kontrol et
    const kayitliKullanici = localStorage.getItem('kullanici');
    
    if (!kayitliKullanici) {
      navigate('/giris'); // Giriş yapmamışsa at
    } else {
      const user = JSON.parse(kayitliKullanici);
      setKullanici(user);
      siparisleriGetir(user.ad);
    }
  }, []);

  // 2. Node.js'ten Siparişleri Çek
  const siparisleriGetir = async (isim) => {
    try {
      const response = await fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/siparislerim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ musteri_ad: isim })
      });
      const data = await response.json();
      setSiparisler(data);
    } catch (error) {
      console.error("Siparişler çekilemedi:", error);
    }
  };

  if (!kullanici) return <div style={{padding: '50px'}}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* ÜST BİLGİ KARTI */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
        padding: '30px', borderRadius: '20px', textAlign: 'center', marginBottom: '40px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>👨‍🚀</div>
        <h2 style={{ margin: '10px 0' }}>Kaptan {kullanici.ad}</h2>
        <p style={{ color: '#aaa' }}>{kullanici.email}</p>
        <div style={{ marginTop: '20px' }}>
          <span style={{ background: '#f39c12', color: 'black', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' }}>
             Uzay Gezgini (Rütbe 1)
          </span>
        </div>
      </div>

      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        📜 Sipariş Geçmişi
      </h3>

      {/* SİPARİŞ LİSTESİ */}
      {siparisler.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>Henüz bir uzay görevi (sipariş) yok.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {siparisler.map((sip) => (
            <div key={sip.id} style={{ 
              backgroundColor: '#111', padding: '20px', borderRadius: '10px', 
              borderLeft: '4px solid #2ecc71', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>Sipariş #{sip.id}</h4>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                  📦 {sip.urunler}
                </p>
                <small style={{ color: '#555' }}>{new Date(sip.tarih).toLocaleDateString()}</small>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2ecc71' }}>{sip.toplam_tutar} TL</div>
                <div style={{ fontSize: '12px', color: '#f39c12' }}>{sip.durum}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Profil;