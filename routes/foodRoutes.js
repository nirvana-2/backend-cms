const express = require('express');
const router = express.Router();
const { getAllFood, getFoodById, createFood, updateFood, deleteFood, getTopFoods } = require('../controllers/foodController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getAllFood);
router.get('/top', getTopFoods);
router.get('/:id', getFoodById);
router.post('/', protect, authorize('admin'), upload.single('image'), createFood);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);

module.exports = router;