import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getWishlists } from '../services/wishlistService';
import WishlistCard from '../components/Dashboard/WishlistCard';
import WishlistFormModal from '../components/Dashboard/WishlistFormModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getWishlists(1, 20, categoria);
      setWishlists(response.data);
    } catch (err) {
      setError('No pudimos cargar el feed. Intenta recargar la página.');
      console.error("Error fetching wishlists:", err);
    } finally {
      setLoading(false);
    }
  }, [categoria]);

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
            HOLA, {user?.perfil?.nombres?.split(' ')[0] || 'AMIGO'}.
          </h1>
          <p className="dashboard-subtitle">Explora los deseos más recientes de la comunidad.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            className="category-filter"
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Cumpleaños">Cumpleaños</option>
            <option value="Boda">Boda</option>
            <option value="Baby Shower">Baby Shower</option>
            <option value="Graduación">Graduación</option>
            <option value="Otro">Otro</option>
          </select>
          <button onClick={openCreateModal} className="create-btn uppercase">
            + Nuevo Deseo
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="feed-loading">
          <div className="loader-spinner"></div>
          <p>Cargando listas recientes...</p>
        </div>
      ) : wishlists.length > 0 ? (
        <div className="feed-vertical">
          {wishlists.map((wishlist) => (
            <WishlistCard 
              key={wishlist._id} 
              wishlist={wishlist} 
              onEdit={() => openEditModal(wishlist)}
              onRefresh={fetchFeed}
            />
          ))}
        </div>
      ) : (
        <div className="feed-empty">
          <h2>El Feed está vacío</h2>
          <p>Aún no hay listas de deseos públicas. ¡Sé el primero en crear una y compártela con tus amigos!</p>
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

export default Dashboard;
