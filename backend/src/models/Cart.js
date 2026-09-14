// Store-Specific Cart System
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, 'Quantity must be at least 1'] 
  }
}, { _id: false }); // We don't need a separate ObjectId for every item inside the array

const cartSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  storeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true,
    index: true
  },
  items: [cartItemSchema],
}, { timestamps: true });

// Ensure a customer only has ONE active cart per store
cartSchema.index({ customerId: 1, storeId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);