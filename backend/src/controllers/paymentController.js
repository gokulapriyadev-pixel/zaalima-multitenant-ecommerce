const razorpay = require('../config/razorpay');

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid amount is required'
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      status: 'success',
      message: 'Razorpay order created successfully',
      order
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create Razorpay order'
    });
  }
};

module.exports = {
  createRazorpayOrder
};