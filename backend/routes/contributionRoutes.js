const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createContribution, getContributionsByWishlist } = require('../controllers/contributionController');
const validateSchema = require('../middlewares/validateSchema');
const { createContributionSchema } = require('../schemas/contributionSchema');

router.use(protect);  // Aportar requiere estar autenticado

router.post('/', validateSchema(createContributionSchema), createContribution);
router.get('/wishlist/:wishlistId', getContributionsByWishlist);

module.exports = router;
