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

// Proteger todas las rutas de usuarios con JWT
router.use(protect);

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
