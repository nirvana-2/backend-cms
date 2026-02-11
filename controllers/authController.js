const connectDB = require('../config/db');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    });
};

const registerUser = async (req, res) => {
    try {
        await connectDB();

        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (userExists) {
            return res.status(400).json({
                message:
                    userExists.email === email
                        ? 'Email already registered'
                        : 'Phone number already registered'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'student'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        await connectDB();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateToken, registerUser, loginUser };
