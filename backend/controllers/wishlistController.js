const Wishlist = require('../models/Wishlist');

exports.getWishlists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const wishlists = await Wishlist.find()
      .populate('creador_id', 'cuenta.username perfil.nombres')
      .skip(skip)
      .limit(limit);
      
    const total = await Wishlist.countDocuments();

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: wishlists
    });
  } catch (error) {
    next(error);
  }
};

exports.createWishlist = async (req, res, next) => {
  try {
    // Si usas el middleware protect, req.user estará disponible
    // req.body.creador_id = req.user.id; 
    const newWishlist = await Wishlist.create(req.body);
    res.status(201).json(newWishlist);
  } catch (error) {
    next(error);
  }
};

exports.getWishlistById = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id).populate('creador_id');
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist not found');
    }
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.updateWishlist = async (req, res, next) => {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Wishlist deleted' });
  } catch (error) {
    next(error);
  }
};
