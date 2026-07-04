const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { requestFriendship, respondFriendship, getFriends } = require('../controllers/friendshipController');

router.use(protect);  // Todas las acciones de amistad requieren JWT

router.post('/request',     requestFriendship);
router.put('/:id/respond',  respondFriendship);
router.get('/user/:userId', getFriends);

module.exports = router;
