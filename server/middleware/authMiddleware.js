// middleware/authMiddleware.js — JWT Verification Middleware
const jwt       = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModel = require('../models/userModel');

/**
 * Protect routes by verifying the JWT Bearer token.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user    = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }

    req.user = user; // findById already excludes password
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
