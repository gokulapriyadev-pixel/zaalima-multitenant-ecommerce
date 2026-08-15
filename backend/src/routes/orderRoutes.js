const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getStoreOrders 
} = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// ==========================================
// Customer Routes
// ==========================================
// Any authenticated user can create an order or view their own past orders
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// ==========================================
// Vendor Routes
// ==========================================
// Only vendors (or super admins) can view all orders placed on their specific store
router.get('/store/:storeId', protect, authorizeRoles('vendor', 'super_admin'), getStoreOrders);

module.exports = router;