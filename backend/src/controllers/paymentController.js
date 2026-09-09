const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const { sendPaymentSuccessEmail } = require('../services/emailService');

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

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

  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: 'INR',
    receipt: `order_${order._id}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    status: 'success',
    message: 'Razorpay order created successfully',
    order: razorpayOrder,
    mongoOrderId: order._id
  });
});

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
}).populate('customerId', 'name email');

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

try {
  await sendPaymentSuccessEmail(order.customerId.email, order);
  console.log('Payment confirmation email sent successfully');
} catch (emailError) {
  console.error(
    'Payment verified, but confirmation email failed:',
    emailError.message
  );
}

res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    orderId: order._id,
    paymentStatus: order.paymentStatus
  });
});


const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];

  if (!webhookSignature) {
    return res.status(400).json({
      status: 'error',
      message: 'Webhook signature is missing'
    });
  }

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(500).json({
      status: 'error',
      message: 'Razorpay webhook secret is not configured'
    });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid webhook signature'
    });
  }

  console.log('🔔 Razorpay webhook received');

  const event = req.body;

  const paymentEntity = event?.payload?.payment?.entity;

  if (!paymentEntity) {
    return res.status(200).json({
      status: 'success',
      message: 'Webhook received'
    });
  }

  const razorpayOrderId = paymentEntity.order_id;

  if (!razorpayOrderId) {
    return res.status(200).json({
      status: 'success',
      message: 'Webhook received'
    });
  }

  const order = await Order.findOne({
    razorpayOrderId
  });

  if (!order) {
    return res.status(200).json({
      status: 'success',
      message: 'Order not found, webhook acknowledged'
    });
  }

  switch (event.event) {
    case 'payment.captured':
    case 'order.paid':
      order.paymentStatus = 'paid';
      break;

    case 'payment.failed':
      order.paymentStatus = 'failed';
      break;

    case 'refund.processed':
      order.paymentStatus = 'refunded';
      break;

    default:
      return res.status(200).json({
        status: 'success',
        message: 'Event received but no action required'
      });
  }

  await order.save();

  return res.status(200).json({
    status: 'success',
    message: 'Webhook processed successfully'
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
};