const express = require('express');
const router = express.Router();
const { requestFriendship, respondFriendship, getFriends } = require('../controllers/friendshipController');

router.post('/request', requestFriendship);
router.put('/:id/respond', respondFriendship);
router.get('/user/:userId', getFriends);

module.exports = router;
