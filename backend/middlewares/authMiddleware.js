const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // JWT_SECRET ya fue validado en app.js al arrancar
  const JWT_SECRET = process.env.JWT_SECRET;

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('No autorizado. Se requiere token JWT.'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, iat, exp }
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Token inválido o expirado'));
  }
};
