const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Store = require('../models/Store');
const Order = require('../models/Order');

/**
 * @desc    Get platform-wide analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Super Admin only)
 */
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVendors = await User.countDocuments({ role: 'vendor' });
  const totalStores = await Store.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Use MongoDB aggregation to quickly sum up all order totals across the entire platform
  const revenueAggregation = await Order.aggregate([
    { 
      $group: { 
        _id: null, 
        totalPlatformRevenue: { $sum: "$totalAmount" } 
      } 
    }
  ]);

  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalPlatformRevenue : 0;

  res.json({
    totalUsers,
    totalVendors,
    totalStores,
    totalOrders,
    totalRevenue: Number(totalRevenue.toFixed(2))
  });
});

/**
 * @desc    Get all stores on the platform
 * @route   GET /api/admin/stores
 * @access  Private (Super Admin only)
 */
const getAllStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({}).populate('ownerId', 'name email');
  res.json(stores);
});

/**
 * @desc    Toggle a store's active status (Activate/Deactivate)
 * @route   PUT /api/admin/stores/:storeId/status
 * @access  Private (Super Admin only)
 */
const toggleStoreStatus = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.storeId);

  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  // Flip the current status
  store.isActive = !store.isActive;
  const updatedStore = await store.save();

  res.json({
    message: `Store has been successfully ${updatedStore.isActive ? 'activated' : 'deactivated'}.`,
    store: updatedStore
  });
});

/**
 * @desc    Get all users across the platform with filtering and search
 * @route   GET /api/admin/users
 * @access  Private (Super Admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;

  const query = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    count: users.length,
    users
  });
});

/**
 * @desc    Get all orders across the entire platform
 * @route   GET /api/admin/orders
 * @access  Private (Super Admin only)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.orderStatus = status;
  }

  let orders = await Order.find(query)
    .populate('customerId', 'name email')
    .populate('storeId', 'name slug')
    .sort({ createdAt: -1 });

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    orders = orders.filter(order => 
      order._id.toString().includes(term) ||
      (order.customerId?.name && order.customerId.name.toLowerCase().includes(term)) ||
      (order.customerId?.email && order.customerId.email.toLowerCase().includes(term)) ||
      (order.storeId?.name && order.storeId.name.toLowerCase().includes(term))
    );
  }

  res.json({
    count: orders.length,
    orders
  });
});

module.exports = {
  getPlatformAnalytics,
  getAllStores,
  toggleStoreStatus,
  getAllUsers,
  getAllOrders
};