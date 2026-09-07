const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getStoreCategories,
    deleteCategory,
    updateCategory,
    createProduct,
    getStoreProducts,
    deleteProduct,
    updateProduct,
    createProductReview,
    uploadProductImage
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ==========================================
// Protected Vendor Routes (Tenant Management)
// ==========================================
// Notice we don't pass `storeId` in the URL for creation.
// We extract it securely from the `req.user` token in the controller!
router.post('/categories', protect, authorizeRoles('vendor', 'super_admin'), createCategory);
router.delete('/categories/:categoryId', protect, authorizeRoles('vendor', 'super_admin'), deleteCategory);
router.put('/categories/:categoryId', protect, authorizeRoles('vendor', 'super_admin'), updateCategory);
router.post('/', protect, authorizeRoles('vendor', 'super_admin'), createProduct);
router.delete('/:productId', protect, authorizeRoles('vendor', 'super_admin'), deleteProduct);
router.put('/:productId', protect, authorizeRoles('vendor', 'super_admin'), updateProduct);
router.post('/upload-image', protect, upload.single('image'), uploadProductImage);

// ==========================================
// Protected Customer Routes
// ==========================================
router.post('/:productId/reviews', protect, createProductReview);

// ==========================================
// Public Routes (Customer Storefront)
// ==========================================
router.get('/categories/:storeId', getStoreCategories);
router.get('/:storeId', getStoreProducts);

module.exports = router;