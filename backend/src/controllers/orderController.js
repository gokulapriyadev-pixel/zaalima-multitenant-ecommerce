const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');

const createOrder = asyncHandler(async (req, res) => {
  const {
    storeId,
    products,
    shippingAddress
  } = req.body;

  if (!storeId || !products || !Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error('Store and products are required');
  }

  // Get products from database
  const productIds = products.map(item => item.productId);

  const dbProducts = await Product.find({
    _id: { $in: productIds },
    storeId
  });

  if (dbProducts.length !== products.length) {
    res.status(400);
    throw new Error('One or more products are invalid');
  }

  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = dbProducts.find(
      p => p._id.toString() === item.productId
    );

    if (!product) {
      res.status(400);
      throw new Error('Product not found');
    }

    if (item.quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    if (product.inventoryCount < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    totalAmount += product.price * item.quantity;

    orderProducts.push({
      productId: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price
    });
  }

  const order = await Order.create({
    storeId,
    customerId: req.user._id,
    products: orderProducts,
    totalAmount,
    paymentStatus: 'pending',
    orderStatus: 'processing',
    shippingAddress
  });

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    order
  });
});

module.exports = {
  createOrder
};