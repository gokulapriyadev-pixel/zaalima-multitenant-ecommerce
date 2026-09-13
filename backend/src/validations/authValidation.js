const { body } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");


const validateRegister = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    
    body("role")
        .optional()
        .isIn(["vendor", "customer"])
        .withMessage("Role must be vendor or customer"),

    validate
];


const validateLogin = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validate
];


module.exports = {
    validateRegister,
    validateLogin
};