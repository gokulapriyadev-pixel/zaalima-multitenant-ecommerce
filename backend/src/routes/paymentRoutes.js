const express = require('express');
const router = express.Router();

const {
  createRazorpayOrder
} = require('../controllers/paymentController');

router.post('/create-order', createRazorpayOrder);

module.exports = router;