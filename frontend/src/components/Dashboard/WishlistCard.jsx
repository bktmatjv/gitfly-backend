import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteWishlist } from '../../services/wishlistService';
import { addReaction } from '../../services/interactionService';
import Avatar from '../Common/Avatar';
import './WishlistCard.css';

const WishlistCard = ({ wishlist, onEdit, onRefresh }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const initialLikes = wishlist?.estadisticas?.likes || 0;
  const [localLikes, setLocalLikes] = useState(initialLikes);
  // Ideally we would check if user liked it, but for now we'll just mock toggle
  const [localLiked, setLocalLiked] = useState(false);

  const handleLike = async () => {
    try {
      await addReaction({ wishlist_id: wishlist._id, tipo_reaccion: 'me_gusta' });
      setLocalLiked(!localLiked);
      setLocalLikes(prev => localLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error(err);
    }
  };
  
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
  const imageUrl = recursos_multimedia?.imagen_url || 'https://giftlystorage.blob.core.windows.net/media/default_gift.png';
  
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
          <div style={{ width: '40px', height: '40px' }}>
            <Avatar url={avatarUrl} name={creatorName} />
          </div>
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
        
        {/* Progress Bar */}
        <div className="post-progress">
          <div className="progress-info">
            <span>Recaudado: ${wishlist?.estado_financiero?.monto_recaudado || 0}</span>
            <span>Meta: ${price}</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(100, ((wishlist?.estado_financiero?.monto_recaudado || 0) / (price || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Post Footer (Actions) */}
      <div className="post-footer">
        <Link to={`/wishlists/${_id}`} className="post-action-btn primary">
          Ver Detalles y Aportar
        </Link>
      </div>

      {/* Post Social Stats */}
      <div className="post-social-stats">
        <button className="social-btn tooltip" title="Vistas">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {wishlist?.estadisticas?.vistas || 0}
        </button>
        <Link to={`/wishlists/${_id}`} className="social-btn tooltip" title="Comentar" style={{ textDecoration: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          {wishlist?.estadisticas?.comentarios || 0}
        </Link>
        <button className="social-btn tooltip" title="Me gusta" onClick={() => handleLike()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={localLiked ? '#ef4444' : 'none'} stroke={localLiked ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {localLikes}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
