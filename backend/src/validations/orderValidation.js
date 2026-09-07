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

    validate
];

module.exports = {
    validateOrder
};