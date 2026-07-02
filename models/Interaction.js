const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wishlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', required: true },
  comentarios: [{
    contenido_texto: { type: String, required: true },
    moderado: { type: Boolean, default: false },
    nombre_autor: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  reacciones: [{
    nombre: { type: String },
    tipo_reaccion: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  metricas_sociales: {
    total_comentarios: { type: Number, default: 0 },
    total_likes: { type: Number, default: 0 }
  },
  seed_tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', InteractionSchema);
