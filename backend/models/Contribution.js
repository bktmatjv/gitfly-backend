// este es el script de contributions :>

const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wishlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', required: true },
  aporte_id: { type: Number },
  auditoria_pago: {
    numero_operacion: { type: String },
    pago_confirmado: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  },
  monto_aportado: { type: Number, required: true },
  nombre_aportante: { type: String },
  pasarela_pago: { type: String },
  resumen_financiero: {
    divisa: { type: String, default: 'USD' },
    estado_fondos: { type: String, default: 'Pendiente' },
    monto_actual: { type: Number, default: 0 },
    monto_meta: { type: Number },
    monto_restante: { type: Number },
    porcentaje_completado: { type: Number, default: 0 }
  },
  seed_tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Contribution', ContributionSchema);
