import React, { useEffect, useState } from 'react';
import AppLayout from '../components/Common/AppLayout';
import { getUserNotifications, markAsRead } from '../services/notificationService';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      // update state locally to feel faster
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, estado_lectura: { ...n.estado_lectura, leido: true } } : n)
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="detail-loading">
        <div className="loader-spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="notifs-container">
        
        <div className="notifs-header">
          <h1 className="uppercase">NOTIFICACIONES</h1>
          <p>Mantente al día con tus listas y amigos.</p>
        </div>

        <div className="notifs-content">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>No tienes notificaciones en este momento.</p>
            </div>
          ) : (
            <div className="notifs-list">
              {notifications.map(n => {
                const isUnread = !n.estado_lectura?.leido;
                return (
                  <div key={n._id} className={`notif-card ${isUnread ? 'unread' : ''}`}>
                    <div className="notif-icon">
                      {n.evento_origen?.tipo_alerta === 'nuevo_aporte' ? '💰' : 
                       n.evento_origen?.tipo_alerta === 'solicitud_amistad' ? '🤝' :
                       n.evento_origen?.tipo_alerta === 'comentario_recibido' ? '💬' : '🔔'}
                    </div>
                    <div className="notif-body">
                      <p>{n.contenido_notificacion?.mensaje_corto}</p>
                      <span className="notif-date">
                        {new Date(n.estado_lectura?.fecha_emision).toLocaleString()}
                      </span>
                      {n.contenido_notificacion?.accion_click && (
                        <Link to={n.contenido_notificacion.accion_click.replace('/app', '')} className="notif-link">
                          Ver detalles
                        </Link>
                      )}
                    </div>
                    {isUnread && (
                      <div className="notif-actions">
                        <button onClick={() => handleMarkAsRead(n._id)}>Marcar como leído</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;
