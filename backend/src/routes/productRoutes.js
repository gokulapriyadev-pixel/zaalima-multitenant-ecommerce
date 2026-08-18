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
    updateProduct
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

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

// ==========================================
// Public Routes (Customer Storefront)
// ==========================================
router.get('/categories/:storeId', getStoreCategories);
router.get('/:storeId', getStoreProducts);

module.exports = router;