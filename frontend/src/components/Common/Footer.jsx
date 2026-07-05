import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.content}>
        <div style={styles.brand}>
          <h2 style={styles.logo}>GIFT<span className="text-gold">LY</span></h2>
          <p style={styles.tagline} className="text-white">Coordina regalos sin complicaciones.</p>
        </div>
        <div style={styles.links}>
          <a href="#" style={styles.link}>Privacidad</a>
          <a href="#" style={styles.link}>Términos</a>
          <a href="#" style={styles.link}>Contacto</a>
        </div>
      </div>
      <div className="container" style={styles.bottom}>
        <p>© {new Date().getFullYear()} Giftly. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--bg-primary)',
    padding: '4rem 0 2rem',
    borderTop: '2px solid rgba(255,255,255,0.1)',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '3rem',
    fontWeight: 900,
    margin: 0,
    color: 'white',
  },
  tagline: {
    marginTop: '0.5rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  bottom: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '2rem',
  }
};

export default Footer;
