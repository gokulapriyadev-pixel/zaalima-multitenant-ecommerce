const express = require('express');
const router = express.Router();

const {
  createProduct,
  getMyProducts,
  getStoreProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  uploadProductImage
} = require('../controllers/productController');

const {
  protect,
  authorizeRoles
} = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

// ==========================================
// PRODUCT ROUTES
// ==========================================

// Get my products
router.get(
  '/',
  protect,
  getMyProducts
);

// Create product
router.post(
  '/',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  createProduct
);

// Upload product image
router.post(
  '/upload-image',
  protect,
  upload.single('image'),
  uploadProductImage
);

// Get products for a public store
router.get(
  '/store/:storeId',
  getStoreProducts
);

// Create product review
router.post(
  '/:productId/reviews',
  protect,
  createProductReview
);

// Get one product
// Get one product
router.get(
  '/:id',
  getProductById
);

// Update product
router.put(
  '/:id',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  updateProduct
);

// Delete product
router.delete(
  '/:id',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  deleteProduct
);

module.exports = router;