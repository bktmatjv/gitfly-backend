const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadMedia } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Solo usuarios autenticados pueden subir archivos
// El campo form-data debe llamarse 'file'
router.post('/media', protect, upload.single('file'), uploadMedia);

module.exports = router;
