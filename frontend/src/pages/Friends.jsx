import React, { useEffect, useState } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { getFriends, respondFriendship } from '../services/friendshipService';
import { useAuth } from '../context/AuthContext';
import './Friends.css';

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const data = await getFriends(user.id);
      
      // Separar entre aceptados y pendientes
      // data retorna { friend: {...}, status: 'aceptado'/'pendiente', friendshipId: '...' }
      const accepted = data.filter(f => f.status === 'aceptado');
      const pendingReq = data.filter(f => f.status === 'pendiente' && f.isIncoming); // Solo los que nos enviaron a nosotros

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
          
          {/* SECCIÓN SOLICITUDES PENDIENTES */}
          {pending.length > 0 && (
            <div className="pending-section">
              <h2>Solicitudes Pendientes ({pending.length})</h2>
              <div className="friends-grid">
                {pending.map(req => (
                  <div key={req.friendshipId} className="friend-card pending-card">
                    <div className="f-avatar">
                      {req.friend.avatar_url ? (
                        <img src={req.friend.avatar_url} alt={req.friend.nombres} />
                      ) : (
                        <span>{req.friend.nombres.charAt(0)}</span>
                      )}
                    </div>
                    <div className="f-info">
                      <h3>{req.friend.nombres} {req.friend.apellidos}</h3>
                      <p>@{req.friend.username}</p>
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
                      {f.friend.avatar_url ? (
                        <img src={f.friend.avatar_url} alt={f.friend.nombres} />
                      ) : (
                        <span>{f.friend.nombres.charAt(0)}</span>
                      )}
                    </div>
                    <div className="f-info">
                      <h3>{f.friend.nombres} {f.friend.apellidos}</h3>
                      <p>@{f.friend.username}</p>
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
