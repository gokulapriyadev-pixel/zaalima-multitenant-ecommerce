const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { validateOrder } = require('../validations/orderValidation');

const {createOrder, getOrderById} = require('../controllers/orderController');

router.post(
    '/', 
    auth,
    roleMiddleware('customer'),
    validateOrder,
    createOrder
);

router.get("/:id", auth, getOrderById);

module.exports = router;