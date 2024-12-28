const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect token to be in format "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };  // Attach user information to the request object
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
