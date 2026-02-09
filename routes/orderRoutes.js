const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getMyOrders,
    getOrderById,
    getOrderHistory,
    getTopSellingFood,
    deleteOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public/Common routes
router.get('/top-selling', protect, getTopSellingFood);

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Staff/Admin routes
router.get('/', protect, authorize('admin', 'staff'), getAllOrders);
router.get('/history', protect, authorize('admin', 'staff'), getOrderHistory);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
