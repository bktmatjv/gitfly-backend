const express = require('express');
const router = express.Router();

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const { createUserSchema, updateUserSchema } = require('../schemas/userSchema');

// Proteger todas las rutas de usuarios con JWT
router.use(protect);

router.get('/', getUsers);
router.post('/', validateSchema(createUserSchema), createUser);
router.get('/:id', getUserById);
router.put('/:id', validateSchema(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
