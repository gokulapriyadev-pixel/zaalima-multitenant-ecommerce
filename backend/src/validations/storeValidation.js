const { body } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");

const validateStore = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required"),

    validate
];

module.exports = {
    validateStore
};