const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for an authenticated user.
 * @param {string} id - The user's MongoDB ObjectId
 * @returns {string} - The signed JWT token
 */
const generateToken = (id) => {
  // Sign the token with the user's ID and our secret key
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

module.exports = generateToken;