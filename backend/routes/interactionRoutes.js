const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addComment, addReaction, getInteractionsByWishlist } = require('../controllers/interactionController');

router.use(protect);  // Comentar y reaccionar requiere estar autenticado

router.post('/comment', addComment);
router.post('/react',   addReaction);
router.get('/wishlist/:wishlistId', getInteractionsByWishlist);

module.exports = router;

