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

// Rutas públicas (lectura)
router.get('/',    getWishlists);
router.get('/:id', getWishlistById);

// Rutas protegidas con JWT
router.use(protect);

router.get('/me',  getMyWishlists);   // ← NUEVA: mis wishlists
router.post('/', validateSchema(createWishlistSchema), createWishlist);
router.put('/:id', validateSchema(updateWishlistSchema), updateWishlist);
router.delete('/:id', deleteWishlist);

module.exports = router;
