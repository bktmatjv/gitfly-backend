import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logo}>
          Gift<span className="text-gold">ly</span>
        </Link>
      </div>
      
      <div style={styles.links}>
        {!isAuthenticated ? (
          <>
            <Link to="/#how-it-works" style={styles.navLink}>Cómo funciona</Link>
            <Link to="/login" style={styles.navLink}>Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-pill bg-pink text-white" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
              CREAR CUENTA
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/my-wishlists" style={styles.navLink}>Mis Listas</Link>
            <span style={{ color: 'var(--text-muted)', margin: '0 1rem' }}>Hola, {user?.perfil?.nombres?.split(' ')[0] || user?.cuenta?.username || 'Usuario'}</span>
            <button onClick={handleLogout} className="btn btn-pill outline-plum text-white" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', borderColor: 'white' }}>
              SALIR
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 5%',
    background: 'transparent',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    fontWeight: 900,
    color: 'white',
    textDecoration: 'none',
    letterSpacing: '-1px',
    textTransform: 'uppercase'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    color: 'white',
    textDecoration: 'none',
    transition: 'opacity 0.3s ease',
  }
};

export default Navbar;
