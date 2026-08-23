const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: [true, 'Store name is required'] 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  description: { 
    type: String 
  },
  logoUrl: { 
    type: String 
  },
  themeColors: {
    primary: { type: String, default: '#000000' },
    secondary: { type: String, default: '#ffffff' }
  },
  contactEmail: { 
    type: String 
  },
    isActive: { 
    type: Boolean, 
    default: true 
  },

}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);