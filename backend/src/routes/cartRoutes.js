const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// All cart routes require the user to be logged in
router.use(protect);

router.post('/', addToCart);
router.get('/:storeId', getCart);
router.put('/:storeId/item/:productId', updateCartItemQuantity);
router.delete('/:storeId/item/:productId', removeFromCart);
router.delete('/:storeId/clear', clearCart);

module.exports = router;