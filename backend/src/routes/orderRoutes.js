const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');

// Get customer's orders
router.get('/', protect, getMyOrders);

// Create order
router.post('/', protect, createOrder);

// Get one order
router.get('/:id', protect, getOrderById);

// Update order status
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;