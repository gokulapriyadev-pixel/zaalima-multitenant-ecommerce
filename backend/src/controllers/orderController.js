const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Cart = require('../models/Cart');

/**
 * @desc    Create a new order (Checkout from Cart)
 * @route   POST /api/orders
 * @access  Private (Logged in users)
 */
const createOrder = asyncHandler(async (req, res) => {
  const { storeId, shippingAddress } = req.body;

  // 1. Verify the store exists
  const store = await Store.findById(storeId);
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  // 2. Fetch the user's cart for this specific store
  const cart = await Cart.findOne({ customerId: req.user._id, storeId });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty for this store.');
  }

  let totalAmount = 0;
  const processedProducts = [];

  // 3. Loop through requested items, validate inventory, and lock in prices
  for (const item of cart.items) {
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

  // 4. Create the order
  const order = await Order.create({
    storeId,
    customerId: req.user._id,
    products: processedProducts,
    totalAmount,
    shippingAddress,
    paymentStatus: 'pending', // Will be updated when Stripe is integrated later
    orderStatus: 'processing'
  });

  // 5. Deduct the purchased quantities from the actual Product inventory
  for (const item of processedProducts) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { inventoryCount: -item.quantity } // Subtracts the purchased quantity
    });
  }

  // 6. EMPTY THE CART
  // After a successful order, we clear the items array from the cart
  cart.items = [];
  await cart.save();

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

/**
 * @desc    Get dashboard analytics for the logged-in vendor
 * @route   GET /api/orders/analytics/my-store
 * @access  Private (Vendor only)
 */
const getStoreAnalytics = asyncHandler(async (req, res) => {
  // 1. Find the vendor's store
  const store = await Store.findOne({ ownerId: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found. Please create a store first.');
  }

  // 2. Fetch all orders for this store
  const orders = await Order.find({ storeId: store._id });

  // 3. Calculate Total Revenue and Total Orders
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // 4. Fetch Low Inventory Products (e.g., less than 5 items left)
  const lowInventoryProducts = await Product.find({ 
    storeId: store._id, 
    inventoryCount: { $lt: 5 } 
  }).select('name inventoryCount price');

  res.json({
    storeName: store.name,
    totalOrders,
    totalRevenue: Number(totalRevenue.toFixed(2)), // Format to 2 decimal places
    lowInventoryItems: lowInventoryProducts.length,
    lowInventoryProducts // Array of products to display as warnings
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:orderId/status
 * @access  Private (Vendor only)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const { orderId } = req.params;

  // 1. Validate the requested status against allowed values in our Model
  const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error('Invalid order status. Allowed values: processing, shipped, delivered, cancelled');
  }

  // 2. Find the order and populate the storeId so we can check ownership
  const order = await Order.findById(orderId).populate('storeId');

  if (!order) {
      res.status(404);
      throw new Error('Order not found');
  }

  // 3. Security Check: Does the logged-in vendor actually own this store?
  if (order.storeId.ownerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to update this order.');
  }

  // 4. Update and save
  order.orderStatus = orderStatus;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getMyOrders,
  getStoreOrders,
  getStoreAnalytics,
  updateOrderStatus
};