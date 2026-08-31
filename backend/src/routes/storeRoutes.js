const express = require('express');
const router = express.Router();

const {
  createStore,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

const { protect } = require('../middlewares/authMiddleware');

// Get all stores owned by logged-in user
router.get('/', protect, getMyStores);

// Create a store
router.post('/', protect, createStore);

// Get one store
router.get('/:id', protect, getStoreById);

// Update store
router.put('/:id', protect, updateStore);

// Delete store
router.delete('/:id', protect, deleteStore);

module.exports = router;