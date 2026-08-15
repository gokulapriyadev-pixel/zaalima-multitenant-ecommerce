const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')
const { createStore } = require('../controllers/storeController');


router.post('/', auth, roleMiddleware("vendor", "superadmin"), createStore);

module.exports = router;