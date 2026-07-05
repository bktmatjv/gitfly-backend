const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const { createWishlistSchema, updateWishlistSchema } = require('../schemas/wishlistSchema');

const {
  getWishlists,
  getMyWishlists,
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist
} = require('../controllers/wishlistController');

// Rutas protegidas con JWT que deben ir ANTES de las rutas con parámetros dinámicos
router.get('/me', protect, getMyWishlists);   // ← NUEVA: mis wishlists

// Rutas públicas (lectura)
router.get('/',    getWishlists);
router.get('/:id', getWishlistById);

// Middleware global para las siguientes rutas protegidas
router.use(protect);
router.post('/', validateSchema(createWishlistSchema), createWishlist);
router.put('/:id', validateSchema(updateWishlistSchema), updateWishlist);
router.delete('/:id', deleteWishlist);

module.exports = router;
