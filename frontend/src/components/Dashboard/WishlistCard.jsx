import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteWishlist } from '../../services/wishlistService';
import './WishlistCard.css';

const WishlistCard = ({ wishlist, onEdit, onRefresh }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    _id, 
    evento, 
    creador_id, 
    item_regalo,
    recursos_multimedia
  } = wishlist;

  const title = evento?.titulo || 'Lista sin título';
  const description = evento?.descripcion || '';
  const eventDate = evento?.fecha_celebracion ? new Date(evento.fecha_celebracion).toLocaleDateString() : 'Fecha por definir';
  const eventType = evento?.categoria || 'evento';
  
  const giftName = item_regalo?.nombre || 'Regalo sorpresa';
  const price = item_regalo?.precio_estimado || 0;
  const currency = item_regalo?.divisa || 'USD';
  const imageUrl = recursos_multimedia?.imagen_url || 'https://via.placeholder.com/600x400?text=Regalo';
  
  // Nombres del creador (populated)
  const creatorName = creador_id?.perfil?.nombres 
    ? `${creador_id.perfil.nombres} ${creador_id.perfil.apellidos || ''}`.trim()
    : (creador_id?.cuenta?.username || 'Usuario');
    
  const avatarUrl = creador_id?.perfil?.avatar_url || null;
  const isOwner = user?.id === creador_id?._id || user?.id === creador_id;

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la lista "${title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteWishlist(_id);
        if (onRefresh) onRefresh();
      } catch (error) {
        alert('Error al eliminar la lista');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="wishlist-post" style={{ opacity: isDeleting ? 0.5 : 1 }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-creator-info">
          {avatarUrl ? (
            <img src={avatarUrl} alt={creatorName} className="post-avatar" />
          ) : (
            <div className="post-avatar-placeholder">
              {creatorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="post-creator-details">
            <span className="post-creator-name">{creatorName}</span>
            <span className="post-date">{eventDate} • {eventType.toUpperCase()}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="post-options-container" style={{ position: 'relative' }}>
            <button className="post-options-btn" onClick={() => setShowMenu(!showMenu)}>
              ⋮
            </button>
            {showMenu && (
              <div className="post-dropdown-menu">
                <button onClick={() => { setShowMenu(false); onEdit(); }}>✏️ Editar</button>
                <button onClick={() => { setShowMenu(false); handleDelete(); }} className="delete-text">🗑️ Eliminar</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Post Image/Video */}
      <div className="post-image-container">
        {imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
          <video src={imageUrl} className="post-image" autoPlay muted loop playsInline />
        ) : (
          <img 
            src={imageUrl} 
            alt={giftName} 
            className="post-image" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'; }} 
          />
        )}
        <div className="post-price-tag">
          {price} {currency}
        </div>
      </div>
      
      {/* Post Body */}
      <div className="post-body">
        <h3 className="post-title">{title}</h3>
        <p className="post-gift">🎁 {giftName}</p>
        <p className="post-desc">{description}</p>
        
        {/* Progress Bar (Mock for now, should calculate from contributions) */}
        <div className="post-progress">
          <div className="progress-info">
            <span>Recaudado: $0</span>
            <span>Meta: ${price}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Post Footer (Actions) */}
      <div className="post-footer">
        <Link to={`/wishlists/${_id}`} className="post-action-btn primary">
          Ver Detalles y Aportar
        </Link>
      </div>
    </div>
  );
};

export default WishlistCard;
