const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Routes
// We apply the 'protect' middleware to ensure only authenticated users can access this
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;