const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  storeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true, 
    index: true 
  },
  code: { 
    type: String, 
    required: true, 
    uppercase: true, 
    trim: true 
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: 0
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  maxUses: { 
    type: Number, 
    default: 0 // 0 means unlimited uses
  }, 
  timesUsed: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Ensure coupon codes are unique per store
couponSchema.index({ storeId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Coupon', couponSchema);