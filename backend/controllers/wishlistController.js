const Wishlist = require('../models/Wishlist');

// ─── GET /api/wishlists ───────────────────────────────────────────────
// Devuelve todas las wishlists (paginado). Para admin / feed público.
exports.getWishlists = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    const filter = {};
    if (req.query.categoria && req.query.categoria !== 'Todas') {
      filter['evento.categoria'] = req.query.categoria;
    }

    const wishlists = await Wishlist.find(filter)
      .populate('creador_id', 'cuenta.username perfil.nombres perfil.apellidos perfil.avatar_url')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Wishlist.countDocuments(filter);

    res.status(200).json({ total, page, totalPages: Math.ceil(total / limit), data: wishlists });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/wishlists/me ────────────────────────────────────────────
// Devuelve las wishlists del usuario autenticado (B-10)
exports.getMyWishlists = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    const filter = { creador_id: req.user.id };

    const wishlists = await Wishlist.find(filter)
      .populate('creador_id', 'cuenta.username perfil.nombres perfil.apellidos perfil.avatar_url')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Wishlist.countDocuments(filter);

    res.status(200).json({ total, page, totalPages: Math.ceil(total / limit), data: wishlists });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/wishlists ──────────────────────────────────────────────
// El creador_id siempre viene del JWT, nunca del body (B-02)
exports.createWishlist = async (req, res, next) => {
  try {
    const newWishlist = await Wishlist.create({
      ...req.body,
      creador_id: req.user.id  // ← Forzado desde el token JWT
    });
    res.status(201).json(newWishlist);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/wishlists/:id ───────────────────────────────────────────
exports.getWishlistById = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate('creador_id', 'cuenta.username perfil.nombres perfil.apellidos perfil.avatar_url');
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist no encontrada');
    }
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/wishlists/:id ───────────────────────────────────────────
// Solo el dueño puede editar (B-03)
exports.updateWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist no encontrada');
    }

    // Verificar ownership
    if (wishlist.creador_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('No autorizado. Solo el creador puede editar esta wishlist.');
    }

    // No permitir cambiar el creador_id aunque venga en el body
    delete req.body.creador_id;

    const updated = await Wishlist.findByIdAndUpdate(
      req.params.id,
      { ...req.body, 'control_estado.ultima_modificacion': new Date() },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/wishlists/:id ────────────────────────────────────────
// Solo el dueño puede eliminar (B-03)
exports.deleteWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist no encontrada');
    }

    // Verificar ownership
    if (wishlist.creador_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('No autorizado. Solo el creador puede eliminar esta wishlist.');
    }

    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Wishlist eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
