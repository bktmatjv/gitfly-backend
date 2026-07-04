const User = require('../models/User');

// Campo a excluir siempre de las respuestas
const EXCLUDE_PASSWORD = '-cuenta.password';

exports.getUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    const users = await User.find()
      .select(EXCLUDE_PASSWORD)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({ total, page, totalPages: Math.ceil(total / limit), data: users });
  } catch (error) {
    next(error);
  }
};

// POST /api/users — solo para uso administrativo (crear usuario sin pasar por /auth/register)
exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // Nunca devolver el hash de la contraseña
    const userObj = newUser.toObject();
    delete userObj.cuenta.password;
    res.status(201).json(userObj);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(EXCLUDE_PASSWORD);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Solo el propio usuario puede actualizar su perfil (o admin)
exports.updateUser = async (req, res, next) => {
  try {
    // Prevenir que se cambie el password por esta ruta (debe ir por /auth)
    if (req.body.cuenta && req.body.cuenta.password) {
      delete req.body.cuenta.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select(EXCLUDE_PASSWORD);

    if (!updatedUser) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
