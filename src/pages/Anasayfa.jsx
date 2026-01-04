import { Link } from 'react-router-dom';

function Anasayfa() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px', 
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      {/* Animasyonlu Logo/İkon */}
      <div className="floating-anim" style={{ fontSize: '100px', marginBottom: '20px' }}>
        🪐
      </div>

      <h1 className="glow-text" style={{ fontSize: '60px', margin: '10px 0', fontWeight: 'bold' }}>
        HAYALPEREST EVRENİ
      </h1>
      
      <p style={{ fontSize: '24px', color: '#ccc', maxWidth: '600px', lineHeight: '1.5' }}>
        Sınırların ötesindeki teknolojilere ulaşmak üzeresiniz.
        <br />
        <span style={{ fontSize: '16px', color: '#888' }}>React & Node.js Gücüyle Çalışır</span>
      </p>
      
      <div style={{ marginTop: '50px' }}>
        <Link to="/magaza" style={{ 
          padding: '20px 50px', 
          fontSize: '22px', 
          background: 'linear-gradient(45deg, #f39c12, #d35400)', // Renk geçişli buton
          color: 'white', 
          textDecoration: 'none', 
          fontWeight: 'bold', 
          borderRadius: '50px',
          boxShadow: '0 10px 20px rgba(243, 156, 18, 0.3)',
          transition: 'transform 0.2s'
        }}>
          Evreni Keşfet 🚀
        </Link>
      </div>
    </div>
  )
}

export default Anasayfa;