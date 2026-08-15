const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');

/**
 * @desc    Create a new order (Checkout)
 * @route   POST /api/orders
 * @access  Private (Logged in users)
 */
const createOrder = asyncHandler(async (req, res) => {
  const { storeId, orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // 1. Verify the store exists
  const store = await Store.findById(storeId);
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  let totalAmount = 0;
  const processedProducts = [];
  // 2. Loop through requested items, validate inventory, and lock in prices
  for (const item of orderItems) {
    const product = await Product.findOne({ _id: item.productId, storeId: storeId });
      
    if (!product) {
      res.status(404);
      throw new Error(`Product not found in this store (ID: ${item.productId})`);
    }

    if (product.inventoryCount < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient inventory for product: ${product.name}`);
    }

    // Calculate total amount for this item and add to overall total
    totalAmount += product.price * item.quantity;

    // Construct the product object exactly as our Order schema expects it
    processedProducts.push({
      productId: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price // Crucial: Taking a snapshot of the current price
    });
  }

  // 3. Create the order
  const order = await Order.create({
    storeId,
    customerId: req.user._id,
    products: processedProducts,
    totalAmount,
    shippingAddress,
    paymentStatus: 'pending', // Will be updated when Stripe is integrated later
    orderStatus: 'processing'
  });

  // 4. Deduct the purchased quantities from the actual Product inventory
  for (const item of processedProducts) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { inventoryCount: -item.quantity } // Subtracts the purchased quantity
    });
  }

  res.status(201).json(order);
});

/**
 * @desc    Get logged in user's (customer's) orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  // Find all orders that belong to the logged-in customer
  const orders = await Order.find({ customerId: req.user._id })
    .populate('storeId', 'name slug')
    .populate('products.productId', 'name images');
  res.json(orders);
});

/**
 * @desc    Get all orders for a specific vendor's store
 * @route   GET /api/orders/store/:storeId
 * @access  Private (Vendor/Admin only)
 */
const getStoreOrders = asyncHandler(async (req, res) => {
  // 1. Verify the logged-in vendor actually owns this store
  const store = await Store.findOne({ _id: req.params.storeId, ownerId: req.user._id });
  if (!store) {
    res.status(403); // Forbidden
    throw new Error('You do not have permission to view orders for this store.');
  }

  // 2. Fetch the orders for this store
  const orders = await Order.find({ storeId: req.params.storeId })
  .populate('customerId', 'name email')
  .populate('products.productId', 'name price');
  res.json(orders);
});

module.exports = {
  createOrder,
  getMyOrders,
  getStoreOrders
};