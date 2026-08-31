const express = require('express');
const router = express.Router();

const {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Get all products owned by logged-in user
router.get('/', protect, getMyProducts);

// Create product
router.post('/', protect, createProduct);

// Get one product
router.get('/:id', protect, getProductById);

// Update product
router.put('/:id', protect, updateProduct);

// Delete product
router.delete('/:id', protect, deleteProduct);

// Upload product image
router.post(
  '/upload-image',
  protect,
  upload.single('image'),
  uploadProductImage
);

module.exports = router;