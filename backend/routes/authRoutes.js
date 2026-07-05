const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const validateSchema = require('../middlewares/validateSchema');
const { protect } = require('../middlewares/authMiddleware');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
