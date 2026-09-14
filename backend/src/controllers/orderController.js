const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');


// ==========================================
// CREATE ORDER
// POST /api/orders
// Access: Private
//
// Supports:
// 1. Direct checkout using products[]
// 2. Cart checkout when products[] is omitted
// ==========================================
const createOrder = asyncHandler(async (req, res) => {
  const {
    storeId,
    products,
    shippingAddress,
    couponCode
  } = req.body;

  if (!storeId) {
    res.status(400);
    throw new Error('Store ID is required');
  }

  // Verify store exists
  const store = await Store.findById(storeId);

  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  let checkoutProducts = [];
  let cart = null;

  // ==========================================
  // OPTION 1: DIRECT PRODUCT CHECKOUT
  // ==========================================
  if (products && Array.isArray(products) && products.length > 0) {

    const productIds = products.map(item => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
      storeId
    });

    if (dbProducts.length !== products.length) {
      res.status(400);
      throw new Error('One or more products are invalid');
    }

    for (const item of products) {
      const product = dbProducts.find(
        p => p._id.toString() === item.productId
      );

      if (!product) {
        res.status(400);
        throw new Error('Product not found');
      }

      if (!item.quantity || item.quantity < 1) {
        res.status(400);
        throw new Error('Quantity must be at least 1');
      }

      if (product.inventoryCount < item.quantity) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      checkoutProducts.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

  } else {

    // ==========================================
    // OPTION 2: CART CHECKOUT
    // ==========================================

    cart = await Cart.findOne({
      customerId: req.user._id,
      storeId
    });

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty for this store.');
    }

    for (const item of cart.items) {

      const product = await Product.findOne({
        _id: item.productId,
        storeId
      });

      if (!product) {
        res.status(404);
        throw new Error(
          `Product not found in this store: ${item.productId}`
        );
      }

      if (product.inventoryCount < item.quantity) {
        res.status(400);
        throw new Error(
          `Insufficient inventory for product: ${product.name}`
        );
      }

      checkoutProducts.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }
  }

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  let totalAmount = checkoutProducts.reduce(
    (total, item) =>
      total + item.priceAtPurchase * item.quantity,
    0
  );

  // ==========================================
  // COUPON
  // ==========================================

  let discountAmount = 0;

  if (couponCode) {

    const coupon = await Coupon.findOne({
      storeId,
      code: couponCode.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      res.status(400);
      throw new Error('Invalid coupon code');
    }

    if (
      coupon.expiryDate &&
      new Date(coupon.expiryDate) < new Date()
    ) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (
      coupon.maxUses > 0 &&
      coupon.timesUsed >= coupon.maxUses
    ) {
      res.status(400);
      throw new Error('Coupon usage limit reached');
    }

    if (coupon.discountType === 'percentage') {
      discountAmount =
        totalAmount * (coupon.discountValue / 100);
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    totalAmount = Math.max(
      0,
      totalAmount - discountAmount
    );

    coupon.timesUsed += 1;
    await coupon.save();
  }

  // ==========================================
  // ATOMICALLY DEDUCT INVENTORY
  // ==========================================

  const deductedProducts = [];
  for (const item of checkoutProducts) {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        inventoryCount: { $gte: item.quantity }
      },
      {
        $inc: { inventoryCount: -item.quantity }
      },
      { new: true }
    );

    if (!updatedProduct) {
      // Roll back any items deducted during this loop
      for (const deducted of deductedProducts) {
        await Product.findByIdAndUpdate(deducted.productId, {
          $inc: { inventoryCount: deducted.quantity }
        });
      }
      res.status(400);
      throw new Error('One or more items are out of stock. Please adjust your cart and try again.');
    }

    deductedProducts.push(item);
  }

  // ==========================================
  // CREATE ORDER
  // ==========================================

  const order = await Order.create({
    storeId,
    customerId: req.user._id,
    products: checkoutProducts,
    totalAmount,
    paymentStatus: 'pending',
    orderStatus: 'processing',
    shippingAddress
  });

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart) {
    cart.items = [];
    await cart.save();
  }

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
    .populate(
      'products.productId',
      'name price images'
    )
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
    .populate(
      'products.productId',
      'name price images'
    );

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
// GET STORE ORDERS
// GET /api/orders/store/:storeId
// Access: Vendor / Super Admin
// ==========================================
const getStoreOrders = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    _id: req.params.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error(
      'You do not have permission to view orders for this store.'
    );
  }

  const orders = await Order.find({
    storeId: req.params.storeId
  })
    .populate('customerId', 'name email')
    .populate(
      'products.productId',
      'name price images'
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: orders.length,
    orders
  });
});


// ==========================================
// STORE ANALYTICS
// GET /api/orders/analytics/my-store
// Access: Vendor / Super Admin
// ==========================================
const getStoreAnalytics = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error(
      'Store not found. Please create a store first.'
    );
  }

  const orders = await Order.find({
    storeId: store._id
  }).sort({ createdAt: -1 });

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const lowInventoryProducts = await Product.find({
    storeId: store._id,
    inventoryCount: { $lt: 5 }
  }).select('name inventoryCount price');

  // 1. Order status distribution
  const orderStatusBreakdown = {
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  };

  // 2. 7-day sales and orders trend
  const salesTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const dayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= d && orderDate < nextD;
    });

    const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    salesTrend.push({
      date: dateLabel,
      day: dayLabel,
      revenue: Math.round(dayRevenue),
      orders: dayOrders.length
    });
  }

  res.status(200).json({
    status: 'success',
    storeName: store.name,
    totalOrders,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    lowInventoryItems: lowInventoryProducts.length,
    lowInventoryProducts,
    orderStatusBreakdown,
    salesTrend
  });
});


// ==========================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// Access: Vendor / Super Admin
// ==========================================
const updateOrderStatus = asyncHandler(async (req, res) => {

  const { orderStatus } = req.body;

  const allowedStatuses = [
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  if (
    !orderStatus ||
    !allowedStatuses.includes(orderStatus)
  ) {
    res.status(400);
    throw new Error(
      'Invalid order status. Allowed values: processing, shipped, delivered, cancelled'
    );
  }

  const order = await Order.findById(
    req.params.id
  ).populate('storeId');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify store ownership
  if (
    order.storeId.ownerId.toString() !==
    req.user._id.toString()
  ) {
    res.status(403);
    throw new Error(
      'You do not have permission to update this order.'
    );
  }

  // Prevent reopening cancelled orders
  if (
    order.orderStatus === 'cancelled' &&
    orderStatus !== 'cancelled'
  ) {
    res.status(400);
    throw new Error(
      'This order has already been cancelled and cannot be reopened.'
    );
  }

  // ==========================================
  // RESTOCK WHEN ORDER IS CANCELLED
  // ==========================================

  if (
    orderStatus === 'cancelled' &&
    order.orderStatus !== 'cancelled'
  ) {

    for (const item of order.products) {

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            inventoryCount: item.quantity
          }
        }
      );
    }
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
  getStoreOrders,
  getStoreAnalytics,
  updateOrderStatus
};