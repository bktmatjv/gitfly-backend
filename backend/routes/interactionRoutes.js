const express = require('express');
const router = express.Router();
const { addComment, addReaction } = require('../controllers/interactionController');

router.post('/comment', addComment);
router.post('/react', addReaction);

module.exports = router;
