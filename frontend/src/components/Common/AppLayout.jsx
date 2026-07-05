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
          <Link to="/" className="sidebar-logo uppercase">GIFTLY</Link>
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
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <div className="avatar">
              {user?.perfil?.nombres ? user.perfil.nombres.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.perfil?.nombres || 'Usuario'}</span>
              <span className="user-handle">@{user?.username || 'user'}</span>
            </div>
          </div>
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
