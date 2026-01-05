import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// App.jsx'ten gönderilen "girisYapFonksiyonu"nu (props) alıyoruz
function Giris({ girisYapFonksiyonu }) {
  const [formData, setFormData] = useState({ email: '', sifre: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const girisYap = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://hayalperest-api-mehmet-2026-v99.onrender.com/api/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // API'den gelen token'ı ve kullanıcı bilgisini Ana Yöneticiye (App.jsx) gönder
        girisYapFonksiyonu(data.kullanici, data.token);
        
        toast.success(`Hoş geldin, ${data.kullanici.ad}! 🛸`);
        navigate('/'); // Ana sayfaya git
      } else {
        toast.error(data.mesaj || 'Giriş başarısız!');
      }
    } catch (error) {
      console.error('Hata:', error);
      toast.error('Sunucuya bağlanılamadı!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="urun-karti" style={{ width: '400px', padding: '40px', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2ecc71' }}>Giriş Yap 🔐</h2>
        
        <form onSubmit={girisYap}>
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

          <button type="submit" style={{ width: '100%', padding: '15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            GİRİŞ YAP
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>
          Hesabın yok mu? <Link to="/kayit" style={{ color: '#2ecc71' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default Giris;