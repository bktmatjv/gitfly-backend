const Contribution = require('../models/Contribution');

exports.createContribution = async (req, res) => {
  try {
    const contribution = await Contribution.create(req.body);
    // Nota: Aquí se debería incluir lógica transaccional para actualizar el 
    // monto_restante en la Wishlist o emitir una notificación.
    res.status(201).json({ message: 'Aporte registrado exitosamente', data: contribution });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getContributionsByWishlist = async (req, res) => {
  try {
    const contributions = await Contribution.find({ wishlist_id: req.params.wishlistId }).populate('usuario_id', 'perfil.nombres');
    res.status(200).json({ message: 'Aportes obtenidos', data: contributions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
