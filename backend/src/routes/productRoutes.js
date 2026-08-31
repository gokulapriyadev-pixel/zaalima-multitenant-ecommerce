const express = require('express');
const router = express.Router();

const {
  createCategory,
  getStoreCategories,
  deleteCategory,
  updateCategory,
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
// CATEGORY ROUTES
// ==========================================

// Create category
router.post(
  '/categories',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  createCategory
);

// Get store categories
router.get(
  '/categories/:storeId',
  getStoreCategories
);

// Update category
router.put(
  '/categories/:categoryId',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  updateCategory
);

// Delete category
router.delete(
  '/categories/:categoryId',
  protect,
  authorizeRoles('vendor', 'super_admin'),
  deleteCategory
);


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
router.get(
  '/:id',
  protect,
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