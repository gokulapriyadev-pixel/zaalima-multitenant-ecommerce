const express = require('express');
const router = express.Router();

const {
  createCategory,
  getMyCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middlewares/authMiddleware');

// Get all categories
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