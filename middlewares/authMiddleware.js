const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    console.log("--- DEBUG AUTHORIZATION ---");
    console.log("Token User Role:", req.user.role);
    console.log("Allowed Roles:", roles);
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'User role not authorized' });
    }
    next();
};

module.exports = { protect, authorize };