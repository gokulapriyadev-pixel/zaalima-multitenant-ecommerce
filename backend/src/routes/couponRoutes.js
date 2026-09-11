const express = require('express');
const router = express.Router();
const { 
  createCoupon, 
  getStoreCoupons, 
  validateCoupon,
  deleteCoupon,
  toggleCouponStatus
} = require('../controllers/couponController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Vendor Routes
router.post('/', protect, authorizeRoles('vendor', 'super_admin'), createCoupon);
router.get('/my-store', protect, authorizeRoles('vendor', 'super_admin'), getStoreCoupons);
router.delete('/:id', protect, authorizeRoles('vendor', 'super_admin'), deleteCoupon);
router.patch('/:id/toggle', protect, authorizeRoles('vendor', 'super_admin'), toggleCouponStatus);

// Customer / Public Route (To calculate totals in cart before checkout)
router.post('/validate', validateCoupon);

module.exports = router;