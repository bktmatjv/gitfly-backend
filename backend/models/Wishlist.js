const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  creador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  control_estado: {
    estado_regalo: { type: String, default: 'Activa' },
    fecha_creacion: { type: Date, default: Date.now },
    permite_financiamiento: { type: Boolean, default: true },
    ultima_modificacion: { type: Date, default: Date.now }
  },
  evento: {
    categoria: { type: String },
    descripcion: { type: String },
    fecha_celebracion: { type: Date },
    titulo: { type: String, required: true }
  },
  item_regalo: {
    divisa: { type: String, default: 'USD' },
    nombre: { type: String, required: true },
    precio_estimado: { type: Number, required: true },
    prioridad_deseo: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
    tienda_sugerida: { type: String },
    url_referencia: { type: String }
  },
  recursos_multimedia: {
    imagen_url: { type: String },
    video_review_url: { type: String }
  },
  estadisticas: {
    vistas: { type: Number, default: 0 },
    comentarios: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  seed_tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
