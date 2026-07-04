const Contribution = require('../models/Contribution');

// ─── POST /api/contributions ──────────────────────────────────────────
// El usuario_id siempre viene del JWT (B-07, B-08)
exports.createContribution = async (req, res, next) => {
  try {
    const { wishlist_id, monto_aportado, pasarela_pago, aporte_id, auditoria_pago, resumen_financiero } = req.body;

    if (!wishlist_id || !monto_aportado) {
      res.status(400);
      throw new Error('Se requieren wishlist_id y monto_aportado.');
    }

    const contribution = await Contribution.create({
      ...req.body,
      usuario_id: req.user.id,  // ← Siempre del JWT
    });

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
