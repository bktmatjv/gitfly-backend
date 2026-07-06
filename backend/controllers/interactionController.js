const Interaction = require('../models/Interaction');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');

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

    // Actualizar global y notificar
    const wishlist = await Wishlist.findById(wishlist_id);
    if (wishlist) {
      wishlist.estadisticas.comentarios = (wishlist.estadisticas.comentarios || 0) + 1;
      await wishlist.save();
      
      if (wishlist.creador_id.toString() !== req.user.id) {
        await Notification.create({
          usuario_destino_id: wishlist.creador_id,
          contenido_notificacion: {
            mensaje_corto: `${req.user.username || 'Alguien'} ha comentado tu lista "${wishlist.evento.titulo}"`,
            accion_click: `/wishlist/${wishlist_id}`
          },
          evento_origen: { tipo_alerta: 'comentario_recibido', entidad_origen_id: interaction._id }
        });
      }
    }

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

    let hasLiked = false;
    const existingIndex = interaction.reacciones.findIndex(r => r.nombre === (req.user.username || 'Usuario'));
    
    if (existingIndex > -1) {
      // Toggle off
      interaction.reacciones.splice(existingIndex, 1);
      interaction.metricas_sociales.total_likes = Math.max(0, interaction.metricas_sociales.total_likes - 1);
      hasLiked = false;
    } else {
      // Toggle on
      interaction.reacciones.push({
        tipo_reaccion,
        nombre: req.user.username || 'Usuario'  // ← Del JWT
      });
      interaction.metricas_sociales.total_likes += 1;
      hasLiked = true;
    }
    
    await interaction.save();

    // Actualizar global y notificar
    const wishlist = await Wishlist.findById(wishlist_id);
    if (wishlist) {
      if (hasLiked) {
        wishlist.estadisticas.likes = (wishlist.estadisticas.likes || 0) + 1;
        if (wishlist.creador_id.toString() !== req.user.id) {
          await Notification.create({
            usuario_destino_id: wishlist.creador_id,
            contenido_notificacion: {
              mensaje_corto: `A ${req.user.username || 'alguien'} le gusta tu lista "${wishlist.evento.titulo}"`,
              accion_click: `/wishlist/${wishlist_id}`
            },
            evento_origen: { tipo_alerta: 'reaccion', entidad_origen_id: interaction._id }
          });
        }
      } else {
        wishlist.estadisticas.likes = Math.max(0, (wishlist.estadisticas.likes || 0) - 1);
      }
      await wishlist.save();
    }

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
