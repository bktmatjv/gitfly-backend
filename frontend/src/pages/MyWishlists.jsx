import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getMyWishlists } from '../services/wishlistService';
import WishlistCard from '../components/Dashboard/WishlistCard';
import WishlistFormModal from '../components/Dashboard/WishlistFormModal';
import './Dashboard.css'; // Reusing dashboard styles

const MyWishlists = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
          <p className="dashboard-subtitle">Gestiona tus listas de deseos.</p>
        </div>
        <button onClick={openCreateModal} className="create-btn uppercase">
          + Nuevo Deseo
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="feed-loading">
          <div className="loader-spinner"></div>
          <p>Cargando tus listas...</p>
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
          <h2>No tienes listas aún</h2>
          <p>¡Crea tu primera lista de deseos para que tus amigos sepan qué regalarte!</p>
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
