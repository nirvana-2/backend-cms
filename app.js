const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://frontend-cms-ebon.vercel.app",
  "https://frontend-2hrlgbbpa-saman-shakyas-projects-f0a62889.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow requests with no origin
    if (allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    )) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('CMS API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
