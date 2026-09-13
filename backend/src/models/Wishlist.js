const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

// Enforce exactly one wishlist per customer, per store
wishlistSchema.index({ customerId: 1, storeId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);