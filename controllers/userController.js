const User = require('../models/user');
//to get user profile
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            })
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
}
//to update user profile
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            })
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
}
//to get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
}
//to delete users
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role == "admin") {
                res.status(400);
                throw new Error('cannot delete the admin')
            }
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'user removed successfully' })
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
}

// @desc    Update user by ID (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, deleteUser, updateUser }
