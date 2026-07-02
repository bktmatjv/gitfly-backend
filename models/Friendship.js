const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
  solicitante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receptor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auditoria_relacion: {
    estado_vinculo: { type: String, enum: ['pendiente', 'aceptado', 'rechazado'], default: 'pendiente' },
    fecha_respuesta: { type: Date },
    fecha_solicitud: { type: Date, default: Date.now }
  },
  configuracion: {
    nivel_prioridad: { type: String, default: 'normal' },
    recibir_notificaciones: { type: Boolean, default: true }
  },
  seed_tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);
