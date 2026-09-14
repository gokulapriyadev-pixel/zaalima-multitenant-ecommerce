const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getStoreOrders,
  getStoreAnalytics,
  updateOrderStatus
} = require('../controllers/orderController');

const {
  protect,
  authorizeRoles
} = require('../middlewares/authMiddleware');

// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create order
router.post('/', protect, createOrder);

// Get customer's orders
router.get('/', protect, getMyOrders);

// Get one customer's order
router.get('/:id', protect, getOrderById);

// ==========================================
// VENDOR / ADMIN ROUTES
// ==========================================

// Get analytics for the logged-in vendor's store
router.get(
  '/analytics/my-store',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  getStoreAnalytics
);

// Get orders for a specific store
router.get(
  '/store/:storeId',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  getStoreOrders
);

// Update order status
router.put(
  '/:id/status',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  updateOrderStatus
);

module.exports = router;