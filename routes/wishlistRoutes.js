const express = require('express');
const router = express.Router();

const {
  getWishlists,
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist
} = require('../controllers/wishlistController');

router.get('/', getWishlists);
router.post('/', createWishlist);
router.get('/:id', getWishlistById);
router.put('/:id', updateWishlist);
router.delete('/:id', deleteWishlist);

module.exports = router;
