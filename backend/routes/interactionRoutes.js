const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addComment, addReaction } = require('../controllers/interactionController');

router.use(protect);  // Comentar y reaccionar requiere estar autenticado

router.post('/comment', addComment);
router.post('/react',   addReaction);

module.exports = router;

