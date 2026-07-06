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
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#9ca3af' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path><polyline points="22 7 12 14 2 7"></polyline><line x1="19" y1="16" x2="19" y2="22"></line><line x1="16" y1="19" x2="22" y2="19"></line></svg>
              </div>
              <p>No tienes notificaciones en este momento.</p>
            </div>
          ) : (
            <div className="notifs-list">
              {notifications.map(n => {
                const isUnread = !n.estado_lectura?.leido;
                return (
                  <div key={n._id} className={`notif-card ${isUnread ? 'unread' : ''}`}>
                    <div className="notif-icon">
                      {n.evento_origen?.tipo_alerta === 'nuevo_aporte' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      ) : n.evento_origen?.tipo_alerta === 'solicitud_amistad' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      ) : n.evento_origen?.tipo_alerta === 'comentario_recibido' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      )}
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
