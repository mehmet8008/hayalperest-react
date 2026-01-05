import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Kayit() {
  const [formData, setFormData] = useState({
    ad_soyad: '',
    email: '',
    sifre: ''
  });
  
  const navigate = useNavigate(); // Sayfa değiştirmek için (React Router aracı)

  // Form elemanları değiştiğinde state'i güncelle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const kayitOl = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engelle

    try {
      const response = await fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Kayıt Başarılı! Giriş yapabilirsiniz.');
        navigate('/giris'); // Kullanıcıyı giriş sayfasına ışınla
      } else {
        toast.error(data.mesaj || 'Kayıt başarısız oldu.');
      }
    } catch (error) {
      console.error('Hata:', error);
      toast.error('Sunucuya bağlanılamadı!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="urun-karti" style={{ width: '400px', padding: '40px', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#f39c12' }}>Üye Kaydı 🚀</h2>
        
        <form onSubmit={kayitOl}>
          <div style={{ marginBottom: '20px' }}>
            <label>Ad Soyad</label>
            <input 
              type="text" name="ad_soyad" required
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }} 
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>E-Posta</label>
            <input 
              type="email" name="email" required
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }} 
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label>Şifre</label>
            <input 
              type="password" name="sifre" required
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }} 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '15px', background: '#f39c12', color: 'black', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            KAYIT OL
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>
          Zaten hesabın var mı? <Link to="/giris" style={{ color: '#f39c12' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Kayit;