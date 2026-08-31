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

module.exports = {
  getPlatformAnalytics,
  getAllStores,
  toggleStoreStatus
};