const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateSchema = require('../middlewares/validateSchema');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

module.exports = router;
