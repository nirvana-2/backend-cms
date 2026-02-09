const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
    }

    try {
        // Set mongoose buffering to false for serverless
        mongoose.set('bufferCommands', false);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        isConnected = conn.connection.readyState === 1;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;