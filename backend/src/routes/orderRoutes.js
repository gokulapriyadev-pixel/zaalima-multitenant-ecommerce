const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { validateOrder } = require('../validations/orderValidation');

const {createOrder} = require('../controllers/orderController');

router.post(
    '/', 
    auth,
    roleMiddleware('customer'),
    validateOrder,
    createOrder
);

module.exports = router;