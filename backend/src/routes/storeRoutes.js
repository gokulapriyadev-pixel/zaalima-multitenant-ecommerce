const express = require('express');
const router = express.Router();

const {
  createStore,
  getMyStores,
  getMyStore,
  getStoreById,
  getStoreBySlug,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

const {
  protect,
  authorizeRoles
} = require('../middlewares/authMiddleware');


// ==========================================
// PROTECTED VENDOR ROUTES
// ==========================================

// Get all stores owned by logged-in user
router.get(
  '/',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  getMyStores
);

// Create a store
router.post(
  '/',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  createStore
);

// Get current vendor's store
router.get(
  '/my-store',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  getMyStore
);

// Update current vendor's store
router.put(
  '/my-store',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  updateStore
);

// Delete current vendor's store
router.delete(
  '/my-store',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  deleteStore
);


// ==========================================
// STORE BY ID
// ==========================================

// Get one store by ID
router.get(
  '/id/:id',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  getStoreById
);

// Update store by ID
router.put(
  '/id/:id',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  updateStore
);

// Delete store by ID
router.delete(
  '/id/:id',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  deleteStore
);


// ==========================================
// PUBLIC STORE ROUTE
// ==========================================

// Customers fetch store using public slug
router.get(
  '/:slug',
  getStoreBySlug
);


module.exports = router;