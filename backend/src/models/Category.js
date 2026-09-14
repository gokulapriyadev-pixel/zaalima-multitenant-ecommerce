const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  storeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

// Ensure category slugs are unique ONLY within a specific store
categorySchema.index({ storeId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);