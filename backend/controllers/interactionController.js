const Interaction = require('../models/Interaction');

// ─── POST /api/interactions/comment ──────────────────────────────────
// usuario_id y nombre_autor vienen del JWT (B-08)
exports.addComment = async (req, res, next) => {
  try {
    const { wishlist_id, contenido_texto } = req.body;

    if (!wishlist_id || !contenido_texto) {
      res.status(400);
      throw new Error('Se requieren wishlist_id y contenido_texto.');
    }

    let interaction = await Interaction.findOne({ usuario_id: req.user.id, wishlist_id });
    if (!interaction) {
      interaction = await Interaction.create({
        usuario_id: req.user.id,  // ← Del JWT
        wishlist_id
      });
    }

    interaction.comentarios.push({
      contenido_texto,
      nombre_autor: req.user.username || 'Usuario'  // ← Del JWT
    });
    interaction.metricas_sociales.total_comentarios += 1;
    await interaction.save();

    res.status(201).json({ message: 'Comentario agregado', data: interaction });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/interactions/reaction ─────────────────────────────────
// usuario_id y nombre vienen del JWT (B-08)
exports.addReaction = async (req, res, next) => {
  try {
    const { wishlist_id, tipo_reaccion } = req.body;

    if (!wishlist_id || !tipo_reaccion) {
      res.status(400);
      throw new Error('Se requieren wishlist_id y tipo_reaccion.');
    }

    let interaction = await Interaction.findOne({ usuario_id: req.user.id, wishlist_id });
    if (!interaction) {
      interaction = await Interaction.create({
        usuario_id: req.user.id,
        wishlist_id
      });
    }

    interaction.reacciones.push({
      tipo_reaccion,
      nombre: req.user.username || 'Usuario'  // ← Del JWT
    });
    interaction.metricas_sociales.total_likes += 1;
    await interaction.save();

    res.status(201).json({ message: 'Reacción registrada', data: interaction });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/interactions/wishlist/:wishlistId ────────────────────────
exports.getInteractionsByWishlist = async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const interactions = await Interaction.find({ wishlist_id: wishlistId })
      .populate('usuario_id', 'cuenta.username perfil.nombres perfil.avatar_url');
    res.status(200).json(interactions);
  } catch (error) {
    next(error);
  }
};
