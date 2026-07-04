const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ usuario_destino_id: req.params.userId }).sort('-createdAt');
    res.status(200).json({ message: 'Notificaciones obtenidas', data: notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { 
        'estado_lectura.leido': true, 
        'estado_lectura.fecha_lectura': new Date() 
      },
      { new: true }
    );
    res.status(200).json({ message: 'Notificación marcada como leída', data: notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
