import React from 'react';
import { Link } from 'react-router-dom';
import './WishlistCard.css';

const WishlistCard = ({ wishlist }) => {
  const { 
    _id, 
    informacion_general, 
    evento, 
    creador_id, 
    elementos 
  } = wishlist;

  const title = informacion_general?.titulo || 'Lista sin título';
  const description = informacion_general?.descripcion || '';
  const eventDate = evento?.fecha_celebracion ? new Date(evento.fecha_celebracion).toLocaleDateString() : 'Fecha por definir';
  const eventType = evento?.tipo_evento || 'Evento';
  
  // Nombres del creador (populated)
  const creatorName = creador_id?.perfil?.nombres 
    ? `${creador_id.perfil.nombres} ${creador_id.perfil.apellidos || ''}`.trim()
    : (creador_id?.cuenta?.username || 'Usuario');
    
  const avatarUrl = creador_id?.perfil?.avatar_url || null;
  const itemCount = elementos?.length || 0;

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-header">
        <span className="wishlist-badge">{eventType.toUpperCase()}</span>
        <span className="wishlist-date">{eventDate}</span>
      </div>
      
      <div className="wishlist-card-body">
        <h3 className="wishlist-title">{title}</h3>
        <p className="wishlist-desc">{description.length > 80 ? description.substring(0, 80) + '...' : description}</p>
        
        <div className="wishlist-stats">
          <div className="stat">
            <span className="stat-icon">🎁</span>
            <span className="stat-value">{itemCount} Regalos</span>
          </div>
        </div>
      </div>
      
      <div className="wishlist-card-footer">
        <div className="creator-info">
          {avatarUrl ? (
            <img src={avatarUrl} alt={creatorName} className="creator-avatar" />
          ) : (
            <div className="creator-avatar-placeholder">
              {creatorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="creator-name">{creatorName}</span>
        </div>
        
        <Link to={`/wishlists/${_id}`} className="view-list-btn">
          VER LISTA
        </Link>
      </div>
    </div>
  );
};

export default WishlistCard;
