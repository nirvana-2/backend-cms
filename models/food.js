const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    image: {
        type: String,
        default: '/uploads/food/default.jpg'
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    countInStock: {
        type: Number,
        required: [true, 'Stock count is required'],
        default: 0
    },
    available: {
        type: Boolean,
        default: true
    },
    //ADDED FOR TOP SELLING LOGIC
    numSales: {
        type: Number,
        default: 0 // Increments every time an order is completed
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    // --- ADDED FOR ROLE ACCOUNTABILITY ---
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);