const express = require('express');
const router = express.Router();

const {
    validateRegister,
    validateLogin
} = require('../validations/authValidation');

const {signup, login, refreshToken} = require('../controllers/authController');

router.post('/signup', validateRegister, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

module.exports = router;