import { Link } from 'react-router-dom';

function Anasayfa() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
      <h1 style={{ fontSize: '50px', margin: '20px 0' }}>🪐 Hayalperest Evreni'ne Hoş Geldin</h1>
      <p style={{ fontSize: '20px', color: '#aaa' }}>
        Burası sıradan bir e-ticaret sitesi değil. Burası geleceğin dijital ekosistemi.
      </p>
      
      <div style={{ marginTop: '40px' }}>
        <Link to="/magaza" style={{ 
          padding: '15px 30px', 
          fontSize: '20px', 
          backgroundColor: '#f39c12', 
          color: 'black', 
          textDecoration: 'none', 
          fontWeight: 'bold', 
          borderRadius: '10px' 
        }}>
          Mağazayı Keşfet 🚀
        </Link>
      </div>
    </div>
  )
}

export default Anasayfa;