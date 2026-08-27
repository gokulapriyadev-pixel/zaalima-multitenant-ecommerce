const express = require('express');
const router = express.Router();

const { createStore } = require('../controllers/storeController');

const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')

const { validateStore } = require('../validations/storeValidation');



router.post(
    '/', 
    auth, 
    roleMiddleware('vendor'), 
    validateStore,
    createStore
);

module.exports = router;