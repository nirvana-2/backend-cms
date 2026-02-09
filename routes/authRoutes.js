const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const connectDB=require("../config/db")

router.post('/register',async(req,res)=>{

    await connectDB();
}, registerUser);
router.post('/login', loginUser);

module.exports = router;
