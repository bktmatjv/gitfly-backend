const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');

router.use(protect);  // Todas las rutas de notificaciones requieren JWT

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;

