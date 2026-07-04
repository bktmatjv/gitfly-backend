const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT_SECRET validado al arranque en app.js
const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res, next) => {
  try {
    const { codigo_alumno, cuenta, perfil } = req.body;
    
    const existingUser = await User.findOne({ 'cuenta.email': cuenta.email });
    if (existingUser) {
      res.status(400);
      throw new Error('El correo ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cuenta.password, salt);

    const newUser = await User.create({
      codigo_alumno,
      cuenta: {
        ...cuenta,
        password: hashedPassword
      },
      perfil
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser._id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 'cuenta.email': email });
    if (!user) {
      res.status(400);
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.cuenta.password);
    if (!isMatch) {
      res.status(400);
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user._id, username: user.cuenta.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, message: 'Login exitoso' });
  } catch (error) {
    next(error);
  }
};
