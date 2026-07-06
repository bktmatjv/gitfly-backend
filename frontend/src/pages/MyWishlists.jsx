import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getMyWishlists } from '../services/wishlistService';
import WishlistCard from '../components/Dashboard/WishlistCard';
import WishlistFormModal from '../components/Dashboard/WishlistFormModal';
import apiClient from '../services/apiClient';
import './Dashboard.css'; // Reusing dashboard styles

const MyWishlists = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Theme and Lang state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'es');

  // Load preferences
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    nombres: user?.perfil?.nombres || '',
    apellidos: user?.perfil?.apellidos || '',
    avatar_url: user?.perfil?.avatar_url || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [activeTab, setActiveTab] = useState('publicaciones');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await apiClient.put('/auth/me', profileForm);
      showToast('¡Perfil actualizado con éxito! 🎉');
    } catch (err) {
      console.error(err);
      showToast('❌ Error al actualizar el perfil.');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyWishlists(1, 20);
      setWishlists(response.data);
    } catch (err) {
      setError('No pudimos cargar tus listas.');
      console.error("Error fetching my wishlists:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const openCreateModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (wishlist) => {
    setEditData(wishlist);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchFeed();
  };

  return (
    <AppLayout>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting uppercase">
            MI PERFIL
          </h1>
          <p className="dashboard-subtitle">Gestiona tu cuenta y publicaciones.</p>
        </div>
        <button onClick={openCreateModal} className="create-btn uppercase">
          + Nuevo Deseo
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setActiveTab('publicaciones')}
          style={{ background: 'none', border: 'none', padding: '1rem 0', color: activeTab === 'publicaciones' ? '#0051ff' : '#888', borderBottom: activeTab === 'publicaciones' ? '2px solid #0051ff' : 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          MIS PUBLICACIONES
        </button>
        <button 
          onClick={() => setActiveTab('datos')}
          style={{ background: 'none', border: 'none', padding: '1rem 0', color: activeTab === 'datos' ? '#0051ff' : '#888', borderBottom: activeTab === 'datos' ? '2px solid #0051ff' : 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          MIS DATOS
        </button>
        <button 
          onClick={() => setActiveTab('ajustes')}
          style={{ background: 'none', border: 'none', padding: '1rem 0', color: activeTab === 'ajustes' ? '#0051ff' : '#888', borderBottom: activeTab === 'ajustes' ? '2px solid #0051ff' : 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          AJUSTES
        </button>
      </div>

      {activeTab === 'publicaciones' && (
        <>
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loader">Cargando tus listas...</div>
          ) : (
            <div className="wishlist-grid">
              {wishlists.length > 0 ? (
                wishlists.map((wishlist) => (
                  <WishlistCard 
                    key={wishlist._id} 
                    wishlist={wishlist} 
                    onEdit={openEditModal}
                    onRefresh={fetchFeed}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>Aún no has creado ninguna Wishlist</h3>
                  <p>Crea tu primera lista de deseos para que tus amigos sepan qué regalarte.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'datos' && (
        <div className="profile-edit-container">
          <h3>Información Personal</h3>
          {toastMessage && (
            <div className="toast-notification animate-pulse">{toastMessage}</div>
          )}
          <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>URL Foto de Perfil (Avatar)</label>
              <input 
                type="text" 
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({...profileForm, avatar_url: e.target.value})}
                placeholder="https://..."
                style={{ color: '#1a1a1a', padding: '10px', width: '100%', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group">
              <label>Nombres</label>
              <input 
                type="text" 
                value={profileForm.nombres}
                onChange={(e) => setProfileForm({...profileForm, nombres: e.target.value})}
                style={{ color: '#1a1a1a', padding: '10px', width: '100%', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input 
                type="text" 
                value={profileForm.apellidos}
                onChange={(e) => setProfileForm({...profileForm, apellidos: e.target.value})}
                style={{ color: '#1a1a1a', padding: '10px', width: '100%', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group" style={{ opacity: 0.6 }}>
              <label>Usuario (No editable)</label>
              <input type="text" value={`@${user?.cuenta?.username}`} disabled style={{ color: '#1a1a1a', padding: '10px', width: '100%', borderRadius: '8px' }} />
            </div>
            <button 
              type="submit" 
              disabled={isUpdating} 
              style={{ marginTop: '1rem', padding: '12px 24px', backgroundColor: '#0051ff', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#003ecc'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#0051ff'}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'ajustes' && (
        <div className="settings-container" style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{lang === 'es' ? 'Ajustes de la cuenta' : 'Account Settings'}</h3>
          
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h4 style={{ margin: 0 }}>{lang === 'es' ? 'Modo Oscuro' : 'Dark Mode'}</h4>
              <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {lang === 'es' ? 'Alternar interfaz clara y oscura' : 'Toggle between light and dark interface'}
              </p>
            </div>
            <div 
              onClick={toggleTheme}
              style={{
                width: '60px',
                height: '32px',
                background: theme === 'dark' ? '#0051ff' : '#e5e7eb',
                borderRadius: '32px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: theme === 'dark' ? '30px' : '2px',
                width: '28px',
                height: '28px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === 'dark' ? '#0051ff' : '#9ca3af',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {theme === 'dark' ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{lang === 'es' ? 'Idioma' : 'Language'}</h4>
              <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {lang === 'es' ? 'Cambia el idioma de la aplicación' : 'Change the application language'}
              </p>
            </div>
            <button 
              onClick={toggleLang}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'es' ? 'Español' : 'English'}
            </button>
          </div>
        </div>
      )}

      <WishlistFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={editData}
      />
    </AppLayout>
  );
};

export default MyWishlists;
