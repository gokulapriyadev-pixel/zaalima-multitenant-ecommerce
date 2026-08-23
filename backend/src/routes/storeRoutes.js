const express = require('express');
const router = express.Router();

const { createStore } = require('../controllers/storeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createStore);

module.exports = router;