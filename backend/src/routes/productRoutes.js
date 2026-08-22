const express = require('express');

const router = express.Router();

const { addProduct } = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware('vendor', 'superadmin'),
    addProduct
);

module.exports = router;