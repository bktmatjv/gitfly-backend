const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Solo usuarios autenticados pueden subir imágenes
// El campo form-data debe llamarse 'image'
router.post('/image', protect, upload.single('image'), uploadImage);

module.exports = router;
