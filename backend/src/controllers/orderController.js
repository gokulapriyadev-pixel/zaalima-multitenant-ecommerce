const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');


// ==========================================
// CREATE ORDER
// POST /api/orders
// Access: Private
// ==========================================
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


// ==========================================
// GET MY ORDERS
// GET /api/orders
// Access: Private
// ==========================================
const getMyOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find({
    customerId: req.user._id
  })
    .populate('storeId', 'name slug')
    .populate('products.productId', 'name price images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: orders.length,
    orders
  });
});


// ==========================================
// GET ORDER BY ID
// GET /api/orders/:id
// Access: Private
// ==========================================
const getOrderById = asyncHandler(async (req, res) => {

  const order = await Order.findOne({
    _id: req.params.id,
    customerId: req.user._id
  })
    .populate('storeId', 'name slug')
    .populate('products.productId', 'name price images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    status: 'success',
    order
  });
});


// ==========================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// Access: Store Owner
// ==========================================
const updateOrderStatus = asyncHandler(async (req, res) => {

  const { orderStatus } = req.body;

  const allowedStatuses = [
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error(
      'Invalid order status. Allowed values: processing, shipped, delivered, cancelled'
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify that the logged-in user owns the store
  const store = await Store.findOne({
    _id: order.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to update this order');
  }

  // Prevent changing a cancelled order
  if (order.orderStatus === 'cancelled') {
    res.status(400);
    throw new Error('Cancelled orders cannot be updated');
  }

  order.orderStatus = orderStatus;

  const updatedOrder = await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully',
    order: updatedOrder
  });
});


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};