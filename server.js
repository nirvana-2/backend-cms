const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// Connect to database before starting
const startServer = async () => {
    try {
        await connectDB();
        
        // Only start server locally, not on Vercel
        if (true) {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Failed to connect to database:', error);
        if (true) {
            process.exit(1);
        }
    }
};

startServer();

module.exports = app;
