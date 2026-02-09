const Food = require('../models/food');
const Order = require('../models/order');
const Cart = require('../models/cart');

// @desc    Create new order from Cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    // Fetch user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.cartItems.length === 0) {
        res.status(400);
        throw new Error('No items in cart to create an order');
    }

    // Calculate total on backend for security
    const total = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const order = new Order({
        user: req.user._id,
        items: cart.cartItems.map(item => ({
            food: item.food,
            quantity: item.qty,
            price: item.price
        })),
        total
    });

    const createdOrder = await order.save();

    // Clear cart after order is successfully created
    cart.cartItems = [];
    await cart.save();

    res.status(201).json({
        success: true,
        data: createdOrder
    });
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            // Validation of status flow: Pending -> Preparing -> Ready -> Paid
            const statusFlow = ['pending', 'preparing', 'ready', 'paid'];
            const currentIdx = statusFlow.indexOf(order.status);
            const newIdx = statusFlow.indexOf(status);

            if (status !== 'cancelled' && newIdx <= currentIdx && order.status !== 'cancelled' && order.status !== 'paid') {
                 return res.status(400).json({
                     success: false,
                     message: `Invalid status transition from ${order.status} to ${status}`
                 });
            }

            order.status = status;
            
            if (status === 'paid') {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.staffHandledBy = req.user._id;
                
                // Increment sales for each food item
                for (const item of order.items) {
                    await Food.findByIdAndUpdate(item.food, {
                        $inc: { numSales: item.quantity }
                    });
                }
            }

            const updatedOrder = await order.save();
            res.json({
                success: true,
                data: updatedOrder
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Staff
const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'name phone')
        .populate('staffHandledBy', 'name')
        .populate('items.food', 'name price image');
    res.json({
        success: true,
        data: orders
    });
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('items.food', 'name price image')
        .sort({ createdAt: -1 });
    res.json({
        success: true,
        data: orders
    });
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name phone')
        .populate('staffHandledBy', 'name')
        .populate('items.food', 'name price image');

    if (order) {
        res.json({
            success: true,
            data: order
        });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}

// @desc    Get order history (paid orders)
// @route   GET /api/orders/history
// @access  Private/Admin/Staff
const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'paid' })
            .populate('user', 'name phone email')
            .populate('items.food', 'name price image')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
};

// @desc    Get top selling food
// @route   GET /api/orders/top-selling
// @access  Private
const getTopSellingFood = async (req, res) => {
    try {
        const foods = await Food.find({}).sort({ numSales: -1 }).limit(5);
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top selling items', error: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await Order.findByIdAndDelete(req.params.id);
            res.json({
                success: true,
                message: 'Order removed'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getMyOrders,
    getOrderById,
    getOrderHistory,
    getTopSellingFood,
    deleteOrder
};
