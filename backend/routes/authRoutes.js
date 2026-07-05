const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const validateSchema = require('../middlewares/validateSchema');
const { verifyToken } = require('../middlewares/authMiddleware');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.get('/me', verifyToken, getMe);

module.exports = router;
