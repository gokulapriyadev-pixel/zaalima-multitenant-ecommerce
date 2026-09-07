const express = require('express');
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
} = require('../controllers/paymentController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;