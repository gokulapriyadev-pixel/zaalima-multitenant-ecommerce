const express = require('express');

const router = express.Router();

const { 
    validateProduct,
    validateProductUpdate 
} = require('../validations/productValidation');

const { 
    addProduct,
    getProducts, 
    getProductById,
    updateProduct,
    deleteProduct 
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    validateProduct,
    addProduct
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    getProducts
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    getProductById
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    validateProductUpdate,
    updateProduct
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    deleteProduct
);

module.exports = router;