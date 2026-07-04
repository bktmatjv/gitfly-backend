import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import giftBoxImg from '../assets/gift_box.png';
import horizontalBagImg from '../assets/horizontal_bag_trans.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const { isAuthenticated, logout } = useAuth();

  // Refs for animations
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const navRef = useRef(null);
  const centerImgRef = useRef(null);

  // Estados para el Menú Flotante
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Muestra el botón flotante si se hace scroll hacia abajo (150px)
      if (window.scrollY > 150) {
        setShowFloatingBtn(true);
      } else {
        setShowFloatingBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    // ENTRANCE ANIMATION (Timeline)
    const tl = gsap.timeline();

    // 1. Navbar slides down
    tl.fromTo(navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    // 2. Text "GIFT UP" scales down and fades in
    tl.fromTo(textRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' },
      "-=0.5" // Start slightly before navbar finishes
    );

    // 3. Gift box rises from the very bottom
    tl.fromTo(imgRef.current,
      { y: 500, opacity: 0 },
      { y: 120, opacity: 1, duration: 1.5, ease: 'power4.out' },
      "-=1" // Overlap with text animation
    );

    // 4. Smart section central image entrance
    gsap.fromTo(centerImgRef.current,
      { y: 150, opacity: 0, scale: 0.8 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: ".smart-section",
          start: "top 60%",
        }
      }
    );

    // 2. STAGGERED ENTRANCE FOR "SOBRE GIFTLY" ELEMENTS
    const aboutElements = gsap.utils.toArray('.feature-point');

    gsap.fromTo('.bg-text',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 0.05,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.smart-section',
          start: 'top 70%',
        }
      }
    );

    gsap.fromTo(aboutElements,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.smart-section',
          start: 'top 60%',
        }
      }
    );

    // Animación de Stacked Cards eliminada por petición del usuario.

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="landing-page">

      {/* FLOATING MENU BUTTON */}
      <div 
        className={`floating-menu-btn ${showFloatingBtn && !isMenuOpen ? 'visible' : ''}`}
        onClick={() => setIsMenuOpen(true)}
      >
        MENU =
      </div>

      {/* FULL SCREEN OVERLAY MENU */}
      <div className={`full-screen-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu-btn" onClick={closeMenu}>X</button>
        <div className="menu-links">
          <a href="#about" onClick={closeMenu} className="menu-link uppercase">SOBRE GIFTLY</a>
          <a href="#como-funciona" onClick={closeMenu} className="menu-link uppercase">CÓMO FUNCIONA</a>
          <a href="#testimonios" onClick={closeMenu} className="menu-link uppercase">TESTIMONIOS</a>
          <div className="menu-divider"></div>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={closeMenu} className="menu-link sub-link uppercase">INICIAR SESIÓN</Link>
              <Link to="/register" onClick={closeMenu} className="menu-link sub-link highlight uppercase">CREAR CUENTA</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="menu-link sub-link uppercase">DASHBOARD</Link>
              <button onClick={() => { closeMenu(); logout(); }} className="menu-link sub-link uppercase" style={{background:'transparent', border:'none', cursor:'pointer'}}>SALIR</button>
            </>
          )}
        </div>
      </div>

      {/* HEADER EXACTAMENTE COMO BOWERY */}
      <nav className="bowery-nav" ref={navRef}>
        <div className="nav-left">
          <a href="#about" className="nav-link uppercase">SOBRE GIFTLY</a>
          <a href="#como-funciona" className="nav-link uppercase">CÓMO FUNCIONA</a>
          <a href="#testimonios" className="nav-link uppercase">TESTIMONIOS</a>
        </div>

        <Link to="/" className="nav-logo uppercase">GIFTLY</Link>

        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link uppercase">INICIAR SESIÓN</Link>
              <Link to="/register" className="nav-btn uppercase">CREAR CUENTA</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link uppercase">DASHBOARD</Link>
              <button onClick={logout} style={{ border: 'none', cursor: 'pointer', background: 'transparent' }} className="nav-link uppercase">SALIR</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <h1 className="hero-title uppercase" ref={textRef}>
          GIFT UP
        </h1>

        <div className="hero-emerging-img" ref={imgRef} style={{ fontSize: 'clamp(10rem, 40vw, 40rem)', lineHeight: 1, textShadow: '0 50px 100px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center' }}>
          🎁
        </div>

        <div className="hero-bottom-content animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <p className="hero-bottom-text">
            Organiza tus listas de deseos y coordina regalos con amigos.<br />
            Sin transacciones monetarias internas, 100% seguro.
          </p>
          <a href="#about" className="nav-btn translucent-btn uppercase" style={{ textDecoration: 'none', display: 'inline-block' }}>
            DESCUBRE CÓMO
          </a>
        </div>
      </section>

      {/* SOBRE GIFTLY - SMART FEATURES SECTION */}
      <section id="about" className="smart-section">

        <div className="smart-top-label">
          <span className="square-icon"></span> SOBRE GIFTLY
        </div>

        {/* Giant Solid Background Text Positioned Freely */}
        <div className="massive-stacked-text uppercase">
          <div className="bg-text-1">GIFT</div>
          <div className="bg-text-2">SMART</div>
          <div className="bg-text-3">EASY</div>
        </div>

        <div className="smart-interactive-container container">
          {/* Central Element (The Leaf in Bowery) */}
          <div className="smart-center-element" ref={centerImgRef}>
            <img src={horizontalBagImg} alt="Giftly Bag" className="horizontal-bag-img" />
          </div>

          <div className="feature-point feature-1">
            <span className="feature-dot">01</span>
            <div className="feature-tooltip-box">
              <h4>CERO COMISIONES</h4>
              <p>Sin transacciones internas, plataforma 100% gratuita.</p>
            </div>
          </div>

          <div className="feature-point feature-2">
            <span className="feature-dot">02</span>
            <div className="feature-tooltip-box">
              <h4>RESERVAS SEGURAS</h4>
              <p>Evita duplicados. Si alguien reserva un regalo, el resto lo sabrá.</p>
            </div>
          </div>

          <div className="feature-point feature-3">
            <span className="feature-dot">03</span>
            <div className="feature-tooltip-box">
              <h4>TIENDAS EXTERNAS</h4>
              <p>Compra el regalo en cualquier tienda en línea, tú decides dónde.</p>
            </div>
          </div>

          <div className="feature-point feature-4">
            <span className="feature-dot">04</span>
            <div className="feature-tooltip-box">
              <h4>FÁCIL COMPARTIR</h4>
              <p>Envía tu wishlist completa usando un simple enlace a tus amigos.</p>
            </div>
          </div>
        </div>

        <div className="smart-cta-container">
          <Link to="/register" className="btn btn-pill bg-blue text-white uppercase">CREAR MI LISTA</Link>
          <Link to="/#how-it-works" className="btn btn-pill outline-blue text-blue uppercase">CÓMO FUNCIONA</Link>
        </div>
      </section>

      {/* STACKED CARDS SECTION */}
      <section id="como-funciona" className="stacked-cards-container">

        {/* Card 01 */}
        <div className="stacked-card card-1">
          <h2 className="card-tab-title uppercase">01. WISHLIST GLOBAL</h2>
          <div className="card-content">
            <div className="card-left">
              <p className="card-desc">Guarda cualquier producto de cualquier tienda en un solo lugar. Si puedes copiar el link, lo puedes pedir.</p>
            </div>
            <div className="card-right">
              <div className="card-illustration-placeholder">
                <span className="placeholder-icon">🌐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 02 */}
        <div className="stacked-card card-2">
          <h2 className="card-tab-title uppercase">02. RESERVAS ANÓNIMAS</h2>
          <div className="card-content">
            <div className="card-left">
              <p className="card-desc">Reserva un regalo sin que tu amigo lo sepa. Evitamos duplicados y mantenemos viva la sorpresa.</p>
            </div>
            <div className="card-right">
              <div className="card-illustration-placeholder">
                <span className="placeholder-icon">🕵️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 03 */}
        <div className="stacked-card card-3">
          <h2 className="card-tab-title uppercase">03. ORGANIZA EVENTOS</h2>
          <div className="card-content">
            <div className="card-left">
              <p className="card-desc">Intercambios, cumpleaños o bodas. Agrupa a tus amigos y coordina los detalles sin fricción.</p>
            </div>
            <div className="card-right">
              <div className="card-illustration-placeholder">
                <span className="placeholder-icon">🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 04 */}
        <div className="stacked-card card-4">
          <h2 className="card-tab-title uppercase">04. SIN COMISIONES</h2>
          <div className="card-content">
            <div className="card-left">
              <p className="card-desc">No procesamos pagos. Compra donde encuentres el mejor precio y simplemente márcalo como comprado.</p>
            </div>
            <div className="card-right">
              <div className="card-illustration-placeholder">
                <span className="placeholder-icon">💸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 05 */}
        <div className="stacked-card card-5">
          <h2 className="card-tab-title uppercase">05. INTERACTÚA</h2>
          <div className="card-content">
            <div className="card-left">
              <p className="card-desc">Conecta, comenta y reacciona. Una verdadera red social dedicada a la emoción de regalar.</p>
            </div>
            <div className="card-right">
              <div className="card-illustration-placeholder">
                <span className="placeholder-icon">🤝</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 6. STORIES SECTION (Asymmetric Grid) */}
      <section id="testimonios" className="stories-section">
        <div className="stories-header">
          <div className="stories-label">
            <span className="square-icon-blue"></span> HISTORIAS
          </div>
          <div className="stories-title-container">
            <h2 className="stories-title">Descubre<br />lo nuevo.</h2>
            <p className="stories-subtitle">Desde tecnología hasta experiencias, siempre estamos cocinando algo fresco para regalar.</p>
          </div>
        </div>

        <div className="stories-grid">
          {/* Card 1: Tall */}
          <div className="story-card card-tall">
            <div className="story-img-placeholder portrait" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513885535851-cf32fc143f15?q=80&w=800&auto=format&fit=crop')" }}>
            </div>
            <h3 className="story-card-title">"¡Nunca fue tan fácil organizar el intercambio navideño con toda mi familia!"</h3>
            <span className="story-card-tag">MARÍA, 28 AÑOS</span>
          </div>

          {/* Card 2: Square, pushed down */}
          <div className="story-card card-square">
            <div className="story-img-placeholder square" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=800&auto=format&fit=crop')" }}></div>
            <h3 className="story-card-title">"Gracias a Giftly, por fin recibí la cafetera que tanto quería sin tener que rogar."</h3>
            <span className="story-card-tag">CARLOS, 34 AÑOS</span>
          </div>

          {/* Card 3: Landscape, pushed further down */}
          <div className="story-card card-landscape">
            <div className="story-img-placeholder landscape" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop')" }}></div>
            <h3 className="story-card-title">"La función de reservas anónimas salvó el cumpleaños sorpresa de mi mejor amiga."</h3>
            <span className="story-card-tag">LAURA, 25 AÑOS</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="giftly-footer">
        <div className="footer-content">
          <div className="footer-col-main">
            <h3 className="footer-heading">Recibe las mejores<br />ideas de regalo</h3>
            <div className="newsletter-form">
              <input type="email" placeholder="Correo electrónico" className="newsletter-input" />
              <button className="newsletter-btn">→</button>
            </div>
            <p className="footer-subtext">Actualizaciones sobre nuevas funciones, guías de regalo y mucho más.</p>
            <div className="social-links">
              <span className="social-icon">in</span>
              <span className="social-icon">tw</span>
              <span className="social-icon">ig</span>
              <span className="social-icon">tk</span>
            </div>
          </div>

          <div className="footer-col-links">
            <ul className="footer-list">
              <li><Link to="/#">Características</Link></li>
              <li><Link to="/#">Cómo funciona</Link></li>
              <li><Link to="/#">Testimonios</Link></li>
              <li><Link to="/#">Precios</Link></li>
            </ul>
          </div>

          <div className="footer-col-links">
            <ul className="footer-list">
              <li><Link to="/#">Únete</Link></li>
              <li><Link to="/#">Términos de Servicio</Link></li>
              <li><Link to="/#">Política de Privacidad</Link></li>
              <li><Link to="/#">Soporte</Link></li>
            </ul>
          </div>

          <div className="footer-col-address">
            <span className="address-title">Oficina</span>
            <p className="address-text">
              Av. Regalos Sorpresa 123<br />
              Piso 4, Distrito Digital<br />
              Lima, Perú
            </p>
            <a href="#" className="map-link">📍 Ver en mapa</a>
          </div>
        </div>

        <div className="footer-bottom">
          <h1 className="footer-logo">GIFTLY</h1>
          <p className="copyright">&copy; 2026 Giftly Inc. Todos los derechos reservados.</p>
        </div>

        {/* Decorative Confetti / Party layer */}
        <div className="footer-illustration">
          <span className="party-shape" style={{ left: '-2%', bottom: '-40px', fontSize: '15rem', transform: 'rotate(15deg)' }}>🎈</span>
          <span className="party-shape" style={{ left: '20%', bottom: '-60px', fontSize: '10rem', transform: 'rotate(-20deg)' }}>✨</span>
          <span className="party-shape" style={{ right: '20%', bottom: '-50px', fontSize: '12rem', transform: 'rotate(25deg)' }}>🎊</span>
          <span className="party-shape" style={{ right: '-2%', bottom: '-40px', fontSize: '16rem', transform: 'rotate(-15deg)' }}>🎁</span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
