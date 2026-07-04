const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createContribution, getContributionsByWishlist } = require('../controllers/contributionController');

router.use(protect);  // Aportar requiere estar autenticado

router.post('/', createContribution);
router.get('/wishlist/:wishlistId', getContributionsByWishlist);

module.exports = router;
