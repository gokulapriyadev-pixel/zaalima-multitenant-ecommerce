const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateOrder = [

    body("products")
        .isArray({ min: 1 })
        .withMessage("At least one product is required"),

    body("products.*.productId")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("totalAmount")
        .isNumeric()
        .withMessage("Total amount must be a number")
        .custom(value => value >= 0)
        .withMessage("Total amount cannot be negative"),

    validate
];

module.exports = {
    validateOrder
};