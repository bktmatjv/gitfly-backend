const Contribution = require('../models/Contribution');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');

// ─── POST /api/contributions ──────────────────────────────────────────
// El usuario_id siempre viene del JWT (B-07, B-08)
exports.createContribution = async (req, res, next) => {
  try {
    const { wishlist_id, monto_aportado, pasarela_pago, aporte_id, auditoria_pago, resumen_financiero } = req.body;

    if (!wishlist_id || !monto_aportado) {
      res.status(400);
      throw new Error('Se requieren wishlist_id y monto_aportado.');
    }

    const wishlist = await Wishlist.findById(wishlist_id);
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist no encontrada.');
    }

    const recaudadoActual = wishlist.estado_financiero?.monto_recaudado || 0;
    const meta = wishlist.item_regalo?.precio_estimado || 0;

    if (recaudadoActual + Number(monto_aportado) > meta) {
      res.status(400);
      throw new Error(`El aporte excede la meta. Solo puedes aportar hasta $${meta - recaudadoActual}.`);
    }

    const contribution = await Contribution.create({
      ...req.body,
      usuario_id: req.user.id,  // ← Siempre del JWT
    });

    if (!wishlist.estado_financiero) wishlist.estado_financiero = {};
    wishlist.estado_financiero.monto_recaudado = recaudadoActual + Number(monto_aportado);
    await wishlist.save();

      if (wishlist.creador_id.toString() !== req.user.id) {
        await Notification.create({
        usuario_destino_id: wishlist.creador_id,
        contenido_notificacion: {
          mensaje_corto: `Alguien ha aportado $${monto_aportado} a tu lista "${wishlist.evento.titulo}"`,
          accion_click: `/wishlist/${wishlist_id}`
        },
        evento_origen: {
          disparador_notificacion: 'aporte',
          entidad_origen_id: contribution._id,
          tipo_alerta: 'nuevo_aporte'
        }
      });
    }

    res.status(201).json({ message: 'Aporte registrado exitosamente', data: contribution });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/contributions/wishlist/:wishlistId ──────────────────────
exports.getContributionsByWishlist = async (req, res, next) => {
  try {
    const contributions = await Contribution.find({ wishlist_id: req.params.wishlistId })
      .populate('usuario_id', 'cuenta.username perfil.nombres perfil.apellidos');

    res.status(200).json({ message: 'Aportes obtenidos', data: contributions });
  } catch (error) {
    next(error);
  }
};
