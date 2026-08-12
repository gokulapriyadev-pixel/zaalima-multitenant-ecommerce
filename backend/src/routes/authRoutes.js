const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Routes
// We apply the 'protect' middleware to ensure only authenticated users can access this
router.get('/me', protect, getMe);

module.exports = router;