import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/Common/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getWishlists } from '../services/wishlistService';
import WishlistCard from '../components/Dashboard/WishlistCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getWishlists(1, 20); // Obtener últimas 20 wishlists
        setWishlists(response.data);
      } catch (err) {
        setError('No pudimos cargar el feed. Intenta recargar la página.');
        console.error("Error fetching wishlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <AppLayout>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting uppercase">
            HOLA, {user?.perfil?.nombres ? user.perfil.nombres : 'AMIGO'}.
          </h1>
          <p className="dashboard-subtitle">Explora los deseos más recientes de la comunidad.</p>
        </div>
        <Link to="/create-wishlist" className="create-btn uppercase">
          + Nueva Lista
        </Link>
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
        <div className="feed-grid">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist._id} wishlist={wishlist} />
          ))}
        </div>
      ) : (
        <div className="feed-empty">
          <h2>El Feed está vacío</h2>
          <p>Aún no hay listas de deseos públicas. ¡Sé el primero en crear una y compártela con tus amigos!</p>
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
