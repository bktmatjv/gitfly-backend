const Interaction = require('../models/Interaction');

exports.addComment = async (req, res) => {
  try {
    // Si no existe interacción para esta wishlist, la creamos
    let interaction = await Interaction.findOne({ wishlist_id: req.body.wishlist_id });
    if (!interaction) {
      interaction = await Interaction.create({ 
        usuario_id: req.body.usuario_id, 
        wishlist_id: req.body.wishlist_id 
      });
    }
    
    interaction.comentarios.push({
      contenido_texto: req.body.contenido_texto,
      nombre_autor: req.body.nombre_autor || 'Usuario Invitado'
    });
    interaction.metricas_sociales.total_comentarios += 1;
    await interaction.save();

    res.status(201).json({ message: 'Comentario agregado a la wishlist', data: interaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addReaction = async (req, res) => {
  try {
    let interaction = await Interaction.findOne({ wishlist_id: req.body.wishlist_id });
    if (!interaction) {
      interaction = await Interaction.create({ 
        usuario_id: req.body.usuario_id, 
        wishlist_id: req.body.wishlist_id 
      });
    }
    
    interaction.reacciones.push({
      tipo_reaccion: req.body.tipo_reaccion,
      nombre: req.body.nombre || 'Reacción'
    });
    interaction.metricas_sociales.total_likes += 1;
    await interaction.save();

    res.status(201).json({ message: 'Reacción registrada', data: interaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
