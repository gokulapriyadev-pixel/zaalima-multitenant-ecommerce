const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value >= 0)
        .withMessage("Price cannot be negative"),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    body("storeId")
        .isMongoId()
        .withMessage("Invalid store ID"),

    validate
];


const validateProductUpdate = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value >= 0)
        .withMessage("Price cannot be negative"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    validate
];

module.exports = {
    validateProduct,
    validateProductUpdate
};