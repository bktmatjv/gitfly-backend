import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/Common/AppLayout';
import { getWishlistById } from '../services/wishlistService';
import { getContributionsByWishlist, createContribution } from '../services/contributionService';
import { getInteractionsByWishlist, addComment, addReaction } from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Common/Avatar';
import './WishlistDetail.css';

const WishlistDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [wishlist, setWishlist] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for new contribution
  const [showContribute, setShowContribute] = useState(false);
  const [amount, setAmount] = useState('');
  
  // States for new comment
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wlData, contribData, interactData] = await Promise.all([
        getWishlistById(id),
        getContributionsByWishlist(id),
        getInteractionsByWishlist(id)
      ]);
      setWishlist(wlData);
      setContributions(contribData);
      setInteractions(interactData);
    } catch (err) {
      setError('Error al cargar la lista de deseos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [toastMessage, setToastMessage] = useState('');
  
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    try {
      await createContribution({
        wishlist_id: id,
        monto_aportado: Number(amount),
        pasarela_pago: 'Yape'
      });
      setAmount('');
      setShowContribute(false);
      showToast('¡Aporte realizado con éxito! 🎉');
      // Recargar contribuciones y detalles (para barra de progreso)
      const wlData = await getWishlistById(id);
      setWishlist(wlData);
      const contribData = await getContributionsByWishlist(id);
      setContributions(contribData);
    } catch (err) {
      console.error("Error al aportar:", err);
      showToast('❌ Error al procesar el aporte.');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment({
        wishlist_id: id,
        contenido_texto: newComment
      });
      setNewComment('');
      // Recargar interacciones
      const interactData = await getInteractionsByWishlist(id);
      setInteractions(interactData);
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };
  
  const handleLike = async () => {
    try {
      await addReaction({
        wishlist_id: id,
        tipo_reaccion: 'me_gusta'
      });
      const interactData = await getInteractionsByWishlist(id);
      setInteractions(interactData);
    } catch (err) {
      console.error("Error al reaccionar:", err);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="detail-loading">
        <div className="loader-spinner"></div>
        <p>Cargando detalles...</p>
      </div>
    </AppLayout>
  );

  if (error || !wishlist) return (
    <AppLayout>
      <div className="detail-error">
        <h2>Ups, algo salió mal.</h2>
        <p>{error || 'Lista no encontrada.'}</p>
        <Link to="/dashboard" className="back-btn">Volver al Feed</Link>
      </div>
    </AppLayout>
  );

  const { informacion_general, evento, item_regalo, recursos_multimedia, creador_id } = wishlist;
  const creatorName = creador_id?.perfil?.nombres 
    ? `${creador_id.perfil.nombres} ${creador_id.perfil.apellidos || ''}`.trim()
    : creador_id?.cuenta?.username;

  // Calcular totales
  const totalMeta = item_regalo?.precio_estimado || 0;
  const totalRecaudado = contributions.reduce((sum, c) => sum + (c.monto_aportado || 0), 0);
  const progressPercent = totalMeta > 0 ? Math.min(100, Math.round((totalRecaudado / totalMeta) * 100)) : 0;

  // Extraer todos los comentarios de todas las interacciones
  let allComments = [];
  interactions.forEach(inter => {
    if (inter.comentarios && inter.comentarios.length > 0) {
      const userAvatar = inter.usuario_id?.perfil?.avatar_url;
      const userName = inter.usuario_id?.cuenta?.username || 'Usuario';
      
      const enrichedComments = inter.comentarios.map(c => ({
        ...c,
        avatar: userAvatar,
        username: userName
      }));
      allComments = [...allComments, ...enrichedComments];
    }
  });

  // Ordenar comentarios (más recientes primero)
  allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Contar likes globales
  let totalLikes = 0;
  interactions.forEach(inter => {
    totalLikes += (inter.metricas_sociales?.total_likes || 0);
  });

  return (
    <AppLayout>
      <div className="wishlist-detail-container">
        {toastMessage && (
          <div className="toast-notification animate-pulse">
            {toastMessage}
          </div>
        )}
        <div className="wishlist-detail-header">
          <Link to="/" className="back-button">← Volver al Feed</Link>
          <div className="wishlist-creator"> <span className="badge-event uppercase">{evento?.categoria || 'General'}</span></div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="detail-content">
          
          {/* LADO IZQUIERDO: Imagen y Detalles */}
          <div className="detail-left">
            <div className="image-container">
              {recursos_multimedia?.imagen_url ? (
                <img src={recursos_multimedia.imagen_url} alt={item_regalo?.nombre} />
              ) : (
                <div className="image-placeholder">🎁</div>
              )}
            </div>
            
            <div className="detail-info-card">
              <h1 className="detail-title">{informacion_general?.titulo || item_regalo?.nombre}</h1>
              <div className="creator-row">
                <Avatar 
                  name={creatorName} 
                  src={creador_id?.perfil?.avatar_url || ''} 
                  size="40px" 
                />
                <span>Creado por <strong>{creatorName}</strong></span>
              </div>
              
              <p className="detail-description">{informacion_general?.descripcion || evento?.descripcion}</p>
              
              <div className="product-details">
                <h3>Regalo Deseado</h3>
                <p><strong>Producto:</strong> {item_regalo?.nombre}</p>
                <p><strong>Tienda:</strong> {item_regalo?.tienda_sugerida}</p>
                {item_regalo?.url_referencia && (
                  <p><a href={item_regalo.url_referencia} target="_blank" rel="noreferrer">Ver en tienda externa ↗</a></p>
                )}
              </div>
            </div>
          </div>

          {/* LADO DERECHO: Finanzas y Social */}
          <div className="detail-right">
            
            {/* META FINANCIERA */}
            <div className="funding-card">
              <h2>Meta de Recaudación</h2>
              <div className="progress-info">
                <span className="amount-current">${totalRecaudado.toFixed(2)}</span>
                <span className="amount-total">de ${totalMeta.toFixed(2)} {item_regalo?.divisa}</span>
              </div>
              
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="progress-text">{progressPercent}% completado</p>

              {!showContribute ? (
                <button className="contribute-btn uppercase" onClick={() => setShowContribute(true)}>
                  Aportar ahora
                </button>
              ) : (
                <form className="contribute-form" onSubmit={handleContribute}>
                  <input 
                    type="number" 
                    placeholder="Monto en $" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="submit-btn uppercase">Pagar con Yape</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowContribute(false)}>Cancelar</button>
                  </div>
                </form>
              )}

              {/* Lista de aportes */}
              <div className="contributions-list">
                <h3>Aportes Recientes</h3>
                {contributions.length === 0 ? (
                  <p className="empty-text">Sé el primero en aportar.</p>
                ) : (
                  contributions.map(c => (
                    <div key={c._id} className="contribution-item">
                      <Avatar 
                        name={c.nombre_aportante || '?'} 
                        src={c.avatar_url || ''} 
                        size="40px" 
                      />
                      <div className="c-info">
                        <strong>{c.nombre_aportante}</strong> aportó ${c.monto_aportado.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECCIÓN SOCIAL (Comentarios e Interacciones) */}
            <div className="social-card">
              <div className="social-header">
                <h2>Interacciones</h2>
                <button className="like-btn" onClick={handleLike}>❤️ {totalLikes}</button>
              </div>

              <div className="comments-section">
                {allComments.length === 0 ? (
                  <p className="empty-text">No hay comentarios aún.</p>
                ) : (
                  allComments.map((c, i) => (
                    <div key={i} className="comment-bubble">
                      <Avatar 
                        name={c.nombre_autor || 'Usuario'} 
                        src={c.avatar || ''} 
                        size="40px" 
                      />
                      <div className="comment-body">
                        <strong>{c.nombre_autor}</strong>
                        <p>{c.contenido_texto}</p>
                        <span className="comment-date">{new Date(c.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="comment-form" onSubmit={handleComment}>
                <input 
                  type="text" 
                  placeholder="Escribe un comentario..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit">Enviar</button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WishlistDetail;
