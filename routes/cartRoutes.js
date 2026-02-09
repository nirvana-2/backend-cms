const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, updateCartItemQuantity } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addToCart);
router.get('/', protect, getCart);
router.put('/:id', protect, updateCartItemQuantity);
router.delete('/:id', protect, removeFromCart);

module.exports = router;