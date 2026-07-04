const Friendship = require('../models/Friendship');

exports.requestFriendship = async (req, res) => {
  try {
    const friendship = await Friendship.create({
      solicitante_id: req.body.solicitante_id,
      receptor_id: req.body.receptor_id
    });
    res.status(201).json({ message: 'Solicitud de amistad enviada', data: friendship });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.respondFriendship = async (req, res) => {
  try {
    const friendship = await Friendship.findByIdAndUpdate(
      req.params.id, 
      { 
        'auditoria_relacion.estado_vinculo': req.body.estado_vinculo, 
        'auditoria_relacion.fecha_respuesta': new Date() 
      },
      { new: true }
    );
    res.status(200).json({ message: 'Respuesta procesada', data: friendship });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friendship.find({
      $or: [{ solicitante_id: req.params.userId }, { receptor_id: req.params.userId }],
      'auditoria_relacion.estado_vinculo': 'aceptado'
    });
    res.status(200).json({ message: 'Lista de amigos', data: friends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
