require('dotenv').config(); // Load environment variables from .env file
const dns = require('dns');

// Fix for local ISP DNS SRV refusal issues (querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect to the Database
connectDB();

// ==========================================
// Middleware
// ==========================================
// Security headers
app.use(helmet());
// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
// Parse incoming JSON payloads
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Basic Routes
// ==========================================
// Health check route to ensure API is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SaaS E-commerce API is running!' });
});

// Future Route Imports will go here:
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ==========================================
// Global Error Handler (Fallback)
// ==========================================
app.use((err, req, res, next) => {
  // If the status code is already set by the controller (e.g., 400 or 401), use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});