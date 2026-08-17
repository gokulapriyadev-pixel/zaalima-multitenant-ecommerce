const express = require('express');
const router = express.Router();
const { 
  createStore, 
  getMyStore, 
  getStoreBySlug,
  deleteStore
} = require('../controllers/storeController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');


// ==========================================
// Protected Vendor Routes
// ==========================================
// We use 'protect' to ensure the user is logged in, and 'authorizeRoles' to ensure they are a vendor
router.post('/', protect, authorizeRoles('vendor', 'super_admin'), createStore);
router.get('/my-store', protect, authorizeRoles('vendor', 'super_admin'), getMyStore);
router.delete('/my-store', protect, authorizeRoles('vendor', 'super_admin'), deleteStore);

// ==========================================
// Public Routes
// ==========================================
// Customers fetching the storefront details via the URL slug
router.get('/:slug', getStoreBySlug);

module.exports = router;