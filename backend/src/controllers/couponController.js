const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const Store = require('../models/Store');

/**
 * @desc    Create a new coupon for a store
 * @route   POST /api/coupons
 * @access  Private (Vendor only)
 */
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, expiryDate, maxUses } = req.body;
    
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) {
        res.status(404);
        throw new Error('Store not found.');
    }

    const couponExists = await Coupon.findOne({ storeId: store._id, code: code.toUpperCase() });
    if (couponExists) {
        res.status(400);
        throw new Error('A coupon with this code already exists for your store.');
    }

    const coupon = await Coupon.create({
        storeId: store._id,
        code,
        discountType,
        discountValue,
        expiryDate,
        maxUses: maxUses || 0
    });

    res.status(201).json(coupon);
});

/**
 * @desc    Get all coupons for a vendor's store
 * @route   GET /api/coupons/my-store
 * @access  Private (Vendor only)
 */
const getStoreCoupons = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) {
        res.status(404);
        throw new Error('Store not found.');
    }

    const coupons = await Coupon.find({ storeId: store._id });
    res.json(coupons);
});

/**
 * @desc    Validate a coupon (For Frontend cart calculations)
 * @route   POST /api/coupons/validate
 * @access  Public / Customer
 */
const validateCoupon = asyncHandler(async (req, res) => {
    const { storeId, code } = req.body;

    if (!storeId || !code || !code.trim()) {
        res.status(400);
        throw new Error('Store ID and Coupon code are required.');
    }

    const coupon = await Coupon.findOne({ 
        storeId, 
        code: code.trim().toUpperCase(), 
        isActive: true 
    });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid or inactive coupon code.');
    }

    const now = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
        res.status(400);
        throw new Error('This coupon has expired.');
    }

    if (coupon.maxUses > 0 && coupon.timesUsed >= coupon.maxUses) {
        res.status(400);
        throw new Error('This coupon has reached its usage limit.');
    }

    res.json({
        message: 'Coupon is valid',
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
    });
});

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private (Vendor only)
 */
const deleteCoupon = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) {
        res.status(404);
        throw new Error('Store not found.');
    }

    const coupon = await Coupon.findOne({ _id: req.params.id, storeId: store._id });
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found for this store.');
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
});

/**
 * @desc    Toggle coupon active status
 * @route   PATCH /api/coupons/:id/toggle
 * @access  Private (Vendor only)
 */
const toggleCouponStatus = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) {
        res.status(404);
        throw new Error('Store not found.');
    }

    const coupon = await Coupon.findOne({ _id: req.params.id, storeId: store._id });
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found for this store.');
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
        message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
        coupon
    });
});

module.exports = {
    createCoupon,
    getStoreCoupons,
    validateCoupon,
    deleteCoupon,
    toggleCouponStatus
};