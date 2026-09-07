const express = require('express');
const router = express.Router();
const { toggleWishlistItem, getStoreWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/toggle', protect, toggleWishlistItem);
router.get('/:storeId', protect, getStoreWishlist);

module.exports = router;