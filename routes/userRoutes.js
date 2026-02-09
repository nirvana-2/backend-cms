const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, deleteUser, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;