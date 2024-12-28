const jwt = require('jsonwebtoken');

// JWT secret for signing and verifying tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
