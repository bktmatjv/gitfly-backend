const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  usuario_destino_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenido_notificacion: {
    accion_click: { type: String },
    mensaje_corto: { type: String, required: true }
  },
  estado_lectura: {
    fecha_emision: { type: Date, default: Date.now },
    fecha_lectura: { type: Date },
    leido: { type: Boolean, default: false }
  },
  evento_origen: {
    disparador_notificacion: { type: String },
    entidad_origen_id: { type: mongoose.Schema.Types.ObjectId },
    tipo_alerta: { type: String }
  },
  seed_tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
