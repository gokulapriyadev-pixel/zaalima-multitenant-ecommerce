const mongoose = require('mongoose');

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
  inventoryCount: { 
    type: Number, 
    required: true, 
    default: 0, 
    min: 0 
  },
  images: [{ 
    type: String // Cloudinary URLs
  }], 
  isPublished: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Ensure product slugs are unique ONLY within a specific store
productSchema.index({ storeId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);