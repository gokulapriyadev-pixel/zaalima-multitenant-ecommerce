const express = require('express');
const router = express.Router();

const {
  createCategory,
  getMyCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getPublicStoreCategories,
  getAllPublicCategories
} = require('../controllers/categoryController');

const { protect } = require('../middlewares/authMiddleware');

// Public Category Routes
router.get('/public', getAllPublicCategories);
router.get('/public/:storeId', getPublicStoreCategories);

// Get all categories (Vendor)
router.get('/', protect, getMyCategories);

// Create category
router.post('/', protect, createCategory);

// Get one category
router.get('/:id', protect, getCategoryById);

// Update category
router.put('/:id', protect, updateCategory);

// Delete category
router.delete('/:id', protect, deleteCategory);

module.exports = router;