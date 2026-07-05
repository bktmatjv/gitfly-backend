import React, { useEffect, useState } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { getFriends, respondFriendship, requestFriendship } from '../services/friendshipService';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import './Friends.css';

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const resData = await getFriends(user.id);
      const friendsList = resData.data || [];
      
      // Separar entre aceptados y pendientes
      const accepted = friendsList.filter(f => f.status === 'aceptado');
      const pendingReq = friendsList.filter(f => f.status === 'pendiente' && f.isIncoming); // Solo los que nos enviaron a nosotros

      setFriends(accepted);
      setPending(pendingReq);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (friendshipId, status) => {
    try {
      await respondFriendship(friendshipId, status);
      fetchFriends(); // recargar
    } catch (err) {
      console.error("Error al responder solicitud:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const res = await getUsers({ search: searchQuery });
      // Filter out ourselves
      const results = res.data.filter(u => u._id !== user.id);
      setSearchResults(results);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await requestFriendship(userId);
      alert('Solicitud enviada!');
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al enviar solicitud');
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="detail-loading">
        <div className="loader-spinner"></div>
        <p>Cargando amigos...</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="friends-container">
        
        <div className="friends-header">
          <h1 className="uppercase">MIS AMIGOS</h1>
          <p>Conecta con las personas que te importan.</p>
        </div>

        <div className="friends-content">
          
          {/* SECCIÓN BUSCAR AMIGOS */}
          <div className="search-section">
            <h2>Buscar Amigos</h2>
            <form onSubmit={handleSearch} className="search-form">
              <input 
                type="text" 
                placeholder="Busca por nombre o @usuario..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={searching}>
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            
            {searchResults.length > 0 && (
              <div className="friends-grid search-results-grid">
                {searchResults.map(u => (
                  <div key={u._id} className="friend-card">
                    <div className="f-avatar">
                      {u.perfil?.avatar_url ? (
                        <img src={u.perfil.avatar_url} alt={u.perfil.nombres} />
                      ) : (
                        <span>{u.perfil?.nombres?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="f-info">
                      <h3>{u.perfil?.nombres} {u.perfil?.apellidos}</h3>
                      <p>@{u.cuenta?.username}</p>
                    </div>
                    <div className="f-actions">
                      <button className="add-friend-btn" onClick={() => handleAddFriend(u._id)}>+ Agregar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* SECCIÓN SOLICITUDES PENDIENTES */}
          {pending.length > 0 && (
            <div className="pending-section">
              <h2>Solicitudes Pendientes ({pending.length})</h2>
              <div className="friends-grid">
                {pending.map(req => (
                  <div key={req.friendshipId} className="friend-card pending-card">
                    <div className="f-avatar">
                      {req.friend?.perfil?.avatar_url ? (
                        <img src={req.friend.perfil.avatar_url} alt={req.friend.perfil.nombres} />
                      ) : (
                        <span>{req.friend?.perfil?.nombres?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="f-info">
                      <h3>{req.friend?.perfil?.nombres} {req.friend?.perfil?.apellidos}</h3>
                      <p>@{req.friend?.cuenta?.username}</p>
                    </div>
                    <div className="f-actions">
                      <button className="accept-btn" onClick={() => handleRespond(req.friendshipId, 'aceptado')}>Aceptar</button>
                      <button className="reject-btn" onClick={() => handleRespond(req.friendshipId, 'rechazado')}>Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN AMIGOS ACEPTADOS */}
          <div className="accepted-section">
            <h2>Mi Círculo ({friends.length})</h2>
            {friends.length === 0 ? (
              <div className="empty-state">
                <p>Aún no tienes amigos registrados. ¡Busca usuarios y envíales una solicitud!</p>
              </div>
            ) : (
              <div className="friends-grid">
                {friends.map(f => (
                  <div key={f.friendshipId} className="friend-card">
                    <div className="f-avatar">
                      {f.friend?.perfil?.avatar_url ? (
                        <img src={f.friend.perfil.avatar_url} alt={f.friend.perfil.nombres} />
                      ) : (
                        <span>{f.friend?.perfil?.nombres?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="f-info">
                      <h3>{f.friend?.perfil?.nombres} {f.friend?.perfil?.apellidos}</h3>
                      <p>@{f.friend?.cuenta?.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
};

export default Friends;
