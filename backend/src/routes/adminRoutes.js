const express = require('express');
const router = express.Router();
const { 
  getPlatformAnalytics, 
  getAllStores, 
  toggleStoreStatus,
  getAllUsers,
  getAllOrders
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// ALL routes in this file are strictly protected for super_admins only
router.use(protect);
router.use(authorizeRoles('super_admin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/stores', getAllStores);
router.put('/stores/:storeId/status', toggleStoreStatus);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);

module.exports = router;