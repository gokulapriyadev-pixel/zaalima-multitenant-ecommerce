const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const BlacklistToken = require('../models/BlacklistToken');

/**
 * Protects routes by verifying the provided JWT token.
 * Attached the authenticated user to the req object (req.user).
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // SECURITY CHECK: Is this token in the blacklist?
      const isBlacklisted = await BlacklistToken.findOne({ token });
      if (isBlacklisted) {
        res.status(401);
        throw new Error('Not authorized, token has been logged out and invalidated');
      }

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database (excluding the password field)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token was found in the header
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Middleware to restrict access to specific roles.
 * Must be used AFTER the 'protect' middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'super_admin', 'vendor')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the logged-in user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(`Role (${req.user.role}) is not authorized to access this resource`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };