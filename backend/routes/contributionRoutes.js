const express = require('express');
const router = express.Router();
const { createContribution, getContributionsByWishlist } = require('../controllers/contributionController');

router.post('/', createContribution);
router.get('/wishlist/:wishlistId', getContributionsByWishlist);

module.exports = router;
