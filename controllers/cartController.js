const Cart = require('../models/cart');
const Food = require('../models/food');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { foodId, quantity } = req.body;
    
    // Fetch food item to get current name, price, and image
    const food = await Food.findById(foodId);
    if (!food) {
        res.status(404);
        throw new Error('Food item not found');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    const cartItem = {
        food: foodId,
        name: food.name,
        image: food.image,
        price: food.price,
        qty: Number(quantity) || 1
    };

    if (cart) {
        // If cart exists, check if food is already in it
        const itemIndex = cart.cartItems.findIndex(item => item.food.toString() === foodId);

        if (itemIndex > -1) {
            // Update quantity if item exists
            cart.cartItems[itemIndex].qty = cartItem.qty;
            // Update latest price and name too
            cart.cartItems[itemIndex].price = food.price;
            cart.cartItems[itemIndex].name = food.name;
            cart.cartItems[itemIndex].image = food.image;
        } else {
            // Add new item if it doesn't exist
            cart.cartItems.push(cartItem);
        }
        await cart.save();
        res.json(cart);
    } else {
        // Create new cart for the user
        const newCart = await Cart.create({
            user: req.user._id,
            cartItems: [cartItem]
        });
        res.status(201).json(newCart);
    }
};

const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        res.json(cart);
    } else {
        res.json({ cartItems: [] });
    }
};
//remove items from cart
const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // filter out the id of the item to be removed
        cart.cartItems = cart.cartItems.filter(
            (item) => item.food.toString() !== req.params.id
        );

        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};
// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItemQuantity = async (req, res) => {
    const { quantity } = req.body;
    const foodId = req.params.id;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemIndex = cart.cartItems.findIndex(item => item.food.toString() === foodId);

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].qty = Number(quantity);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartItemQuantity };