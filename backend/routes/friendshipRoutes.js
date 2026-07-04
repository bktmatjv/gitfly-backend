const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { requestFriendship, respondFriendship, getFriends } = require('../controllers/friendshipController');
const validateSchema = require('../middlewares/validateSchema');
const { createFriendshipSchema, updateFriendshipSchema } = require('../schemas/friendshipSchema');

router.use(protect);  // Todas las acciones de amistad requieren JWT

router.post('/request', validateSchema(createFriendshipSchema), requestFriendship);
router.put('/:id/respond', validateSchema(updateFriendshipSchema), respondFriendship);
router.get('/user/:userId', getFriends);

module.exports = router;
