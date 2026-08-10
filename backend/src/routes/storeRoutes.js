const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createStore } = require('../controllers/storeController');

router.post('/', auth, createStore);

module.exports = router;