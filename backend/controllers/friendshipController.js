const Friendship = require('../models/Friendship');

// ─── POST /api/friendships/request ───────────────────────────────────
// El solicitante siempre es el usuario autenticado (B-05)
exports.requestFriendship = async (req, res, next) => {
  try {
    const { receptor_id } = req.body;

    if (!receptor_id) {
      res.status(400);
      throw new Error('Se requiere el ID del receptor (receptor_id).');
    }

    // No puedes enviarte solicitud a ti mismo
    if (receptor_id === req.user.id) {
      res.status(400);
      throw new Error('No puedes enviarte una solicitud de amistad a ti mismo.');
    }

    // Verificar que no exista ya una solicitud entre ambos
    const existing = await Friendship.findOne({
      $or: [
        { solicitante_id: req.user.id, receptor_id },
        { solicitante_id: receptor_id, receptor_id: req.user.id }
      ]
    });

    if (existing) {
      res.status(409);
      throw new Error('Ya existe una solicitud o amistad entre estos usuarios.');
    }

    const friendship = await Friendship.create({
      solicitante_id: req.user.id,  // ← Forzado desde JWT (B-05)
      receptor_id
    });

    res.status(201).json({ message: 'Solicitud de amistad enviada', data: friendship });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/friendships/:id/respond ────────────────────────────────
// Solo el receptor puede aceptar/rechazar (B-09)
exports.respondFriendship = async (req, res, next) => {
  try {
    const { estado_vinculo } = req.body;

    if (!['aceptado', 'rechazado'].includes(estado_vinculo)) {
      res.status(400);
      throw new Error('estado_vinculo debe ser "aceptado" o "rechazado".');
    }

    const friendship = await Friendship.findById(req.params.id);
    if (!friendship) {
      res.status(404);
      throw new Error('Solicitud de amistad no encontrada.');
    }

    // Verificar que quien responde es el receptor (B-09)
    if (friendship.receptor_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('No autorizado. Solo el receptor puede responder esta solicitud.');
    }

    // Solo se puede responder si sigue pendiente
    if (friendship.auditoria_relacion.estado_vinculo !== 'pendiente') {
      res.status(409);
      throw new Error('Esta solicitud ya fue respondida anteriormente.');
    }

    friendship.auditoria_relacion.estado_vinculo = estado_vinculo;
    friendship.auditoria_relacion.fecha_respuesta = new Date();
    await friendship.save();

    res.status(200).json({ message: 'Respuesta procesada', data: friendship });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/friendships/user/:userId ───────────────────────────────
exports.getFriends = async (req, res, next) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ solicitante_id: req.params.userId }, { receptor_id: req.params.userId }],
      'auditoria_relacion.estado_vinculo': { $in: ['aceptado', 'pendiente'] }
    }).populate('solicitante_id receptor_id', 'cuenta.username perfil.nombres perfil.avatar_url');

    const formattedData = friendships.map(f => {
      const isIncoming = f.receptor_id._id.toString() === req.params.userId;
      const friendData = isIncoming ? f.solicitante_id : f.receptor_id;
      
      return {
        friendshipId: f._id,
        status: f.auditoria_relacion.estado_vinculo,
        isIncoming,
        friend: friendData
      };
    });

    res.status(200).json({ message: 'Lista de amigos', data: formattedData });
  } catch (error) {
    next(error);
  }
};
