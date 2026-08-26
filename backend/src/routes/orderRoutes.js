const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getStoreOrders,
  getStoreAnalytics,
  updateOrderStatus
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
router.get('/analytics/my-store', protect, authorizeRoles('vendor', 'super_admin'), getStoreAnalytics);

router.get('/store/:storeId', protect, authorizeRoles('vendor', 'super_admin'), getStoreOrders);
router.put('/:orderId/status', protect, authorizeRoles('vendor', 'super_admin'), updateOrderStatus);

module.exports = router;