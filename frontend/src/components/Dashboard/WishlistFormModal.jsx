import React, { useState, useEffect } from 'react';
import './WishlistFormModal.css';
import { createWishlist, updateWishlist } from '../../services/wishlistService';

const WishlistFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_celebracion: '',
    categoria: 'cumpleaños',
    nombre_regalo: '',
    precio_estimado: '',
    imagen_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.evento?.titulo || '',
        descripcion: initialData.evento?.descripcion || '',
        fecha_celebracion: initialData.evento?.fecha_celebracion ? initialData.evento.fecha_celebracion.split('T')[0] : '',
        categoria: initialData.evento?.categoria || 'cumpleaños',
        nombre_regalo: initialData.item_regalo?.nombre || '',
        precio_estimado: initialData.item_regalo?.precio_estimado || '',
        imagen_url: initialData.recursos_multimedia?.imagen_url || ''
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_celebracion: '',
        categoria: 'cumpleaños',
        nombre_regalo: '',
        precio_estimado: '',
        imagen_url: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Map to backend schema
    const payload = {
      evento: {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha_celebracion: new Date(formData.fecha_celebracion),
        categoria: formData.categoria
      },
      item_regalo: {
        nombre: formData.nombre_regalo,
        precio_estimado: Number(formData.precio_estimado)
      },
      recursos_multimedia: {
        imagen_url: formData.imagen_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'
      }
    };

    try {
      if (isEditing) {
        await updateWishlist(initialData._id, payload);
      } else {
        await createWishlist(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{isEditing ? 'Editar Deseo' : 'Nuevo Deseo'}</h2>
        
        {error && <div className="modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="wishlist-form">
          <div className="form-section">
            <h3>Evento</h3>
            <div className="form-group">
              <label>Título del Evento *</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required placeholder="Ej: Mi Cumpleaños 25" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={formData.categoria} onChange={handleChange}>
                  <option value="cumpleaños">Cumpleaños</option>
                  <option value="boda">Boda</option>
                  <option value="graduación">Graduación</option>
                  <option value="viaje">Viaje</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" name="fecha_celebracion" value={formData.fecha_celebracion} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" placeholder="Cuéntales a tus amigos por qué quieres esto..."></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Regalo</h3>
            <div className="form-group">
              <label>¿Qué regalo quieres? *</label>
              <input type="text" name="nombre_regalo" value={formData.nombre_regalo} onChange={handleChange} required placeholder="Ej: PlayStation 5" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Precio Estimado (USD) *</label>
                <input type="number" name="precio_estimado" value={formData.precio_estimado} onChange={handleChange} required min="1" step="0.5" />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Publicar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WishlistFormModal;
