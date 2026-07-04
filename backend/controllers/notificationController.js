const Notification = require('../models/Notification');

// ─── GET /api/notifications ───────────────────────────────────────────
// Solo devuelve las notificaciones del usuario autenticado (B-06)
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      usuario_destino_id: req.user.id  // ← Siempre del JWT, no de la URL
    }).sort({ 'estado_lectura.fecha_emision': -1 });

    res.status(200).json({ message: 'Notificaciones obtenidas', data: notifications });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/:id/read ───────────────────────────────
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404);
      throw new Error('Notificación no encontrada.');
    }

    // Verificar que la notificación pertenece al usuario autenticado
    if (notification.usuario_destino_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('No autorizado para marcar esta notificación.');
    }

    notification.estado_lectura.leido = true;
    notification.estado_lectura.fecha_lectura = new Date();
    await notification.save();

    res.status(200).json({ message: 'Notificación marcada como leída', data: notification });
  } catch (error) {
    next(error);
  }
};
