const User = require('../models/user');
const jwt = require('jsonwebtoken');
// to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
        res.status(400);
        const message = userExists.email === email
            ? 'Email already registered'
            : 'Phone number already registered';
        throw new Error(message);
    }
    //check for empty spaces
    if (!name || !email || !password || !phone) {
        res.status(400).json({ message: 'Please fill all fields' })
    }
    //check for valid email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Please enter a valid email' })
    }
    //check for valid phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        res.status(400).json({ message: "please enter a valid phone number" })
    }
    //check for valid password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: "Please enter a valid password" })
    }
    //create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'student',
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
        })
    }
}
//for login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    //to validate input
    if (!email || !password) {
        res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await User.findOne({ email });
    //check if user exists and passwor is correct
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' })
    }
}
module.exports = { registerUser, loginUser };
