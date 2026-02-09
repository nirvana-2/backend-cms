const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Food'
            },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true, default: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);