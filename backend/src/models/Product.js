const mongoose = require('mongoose');

// Sub-schema for individual reviews
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  // Product inventory
  inventoryCount: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },

  // Cloudinary image URLs
  images: [{
    type: String
  }],

  isPublished: {
    type: Boolean,
    default: false
  },

  reviews: [reviewSchema],

  rating: {
    type: Number,
    required: true,
    default: 0
  },

  numReviews: {
    type: Number,
    required: true,
    default: 0
  }

}, {
  timestamps: true
});

// Ensure product slugs are unique only within a specific store
productSchema.index(
  { storeId: 1, slug: 1 },
  { unique: true }
);

module.exports = mongoose.model('Product', productSchema);