const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

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
router.post('/',   createWishlist);
router.put('/:id', updateWishlist);
router.delete('/:id', deleteWishlist);

module.exports = router;
