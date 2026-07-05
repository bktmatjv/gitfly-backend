import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo uppercase">GIFTLY</Link>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="sidebar-icon">🌍</span>
            <span className="sidebar-label uppercase">FEED</span>
          </Link>
          <Link to="/friends" className={`sidebar-link ${location.pathname === '/friends' ? 'active' : ''}`}>
            <span className="sidebar-icon">👥</span>
            <span className="sidebar-label uppercase">AMIGOS</span>
          </Link>
          <Link to="/notifications" className={`sidebar-link ${location.pathname === '/notifications' ? 'active' : ''}`}>
            <span className="sidebar-icon">🔔</span>
            <span className="sidebar-label uppercase">ALERTAS</span>
          </Link>
          <Link to="/my-wishlists" className={`sidebar-link ${location.pathname === '/my-wishlists' ? 'active' : ''}`}>
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-label uppercase">MI PERFIL</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/my-wishlists" className="user-profile-mini" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="avatar">
              {user?.perfil?.nombres ? user.perfil.nombres.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.perfil?.nombres || 'Usuario'}</span>
              <span className="user-handle">@{user?.cuenta?.username || 'user'}</span>
            </div>
          </Link>
          <button onClick={logout} className="logout-btn uppercase">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
