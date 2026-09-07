const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  role: {
    type: String,
    enum: ['super_admin', 'vendor', 'customer'],
    default: 'customer',
  },
  // If a customer registers directly on a vendor's store, track their origin
  registeredAtStore: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store',
    default: null
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// ==========================================
// Mongoose Middleware: Hash Password Before Saving
// ==========================================
// FIX: Removed 'next' parameter. Modern Mongoose handles async functions automatically.
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  // If bcrypt throws an error here, the async function automatically 
  // rejects the promise, and our Express global error handler catches it safely.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// Instance Method: Compare Passwords for Login
// ==========================================
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Compares plain text password entered by user with the hashed password in DB
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);