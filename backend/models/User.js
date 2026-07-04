const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  codigo_alumno: { type: String },
  cuenta: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    estado_registro: { type: String, default: 'Activo' },
    username: { type: String, required: true, unique: true }
  },
  metadata_sistema: {
    cuenta_activa: { type: Boolean, default: true },
    dispositivo_os: { type: String },
    fecha_registro: { type: Date, default: Date.now },
    ultimo_acceso: { type: Date, default: Date.now }
  },
  perfil: {
    apellidos: { type: String },
    avatar_url: { type: String },
    biografia: { type: String },
    nombres: { type: String },
    seed_tag: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
