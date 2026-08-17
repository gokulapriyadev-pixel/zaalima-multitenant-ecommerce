const asyncHandler = require('express-async-handler');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  // Find the existing MongoDB order
  const order = await Order.findOne({
    _id: orderId,
    customerId: req.user._id
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Use the amount calculated by the backend
  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: 'INR',
    receipt: `order_${order._id}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Save Razorpay order ID in MongoDB
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    status: 'success',
    message: 'Razorpay order created successfully',
    order: razorpayOrder,
    mongoOrderId: order._id
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment
};
const crypto = require('crypto');

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification details are required');
  }

  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
    customerId: req.user._id
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    order.paymentStatus = 'failed';
    await order.save();

    res.status(400);
    throw new Error('Invalid payment signature');
  }

  order.paymentStatus = 'paid';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    orderId: order._id,
    paymentStatus: order.paymentStatus
  });
});