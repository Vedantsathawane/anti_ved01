// controllers/authController.js — Auth Controller (MVC Controller Layer)
// Handles all request/response logic for authentication

const jwt       = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModel = require('../models/userModel');

/**
 * Generate a signed JWT token for a given user ID.
 */
const generateToken = (id) =>
  jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register  — Create a new account
// ─────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Input Validation ──────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // ── Check Duplicate Email ─────────────────────────────────
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // ── Create User (Model handles hashing + DB insert) ───────
    const user  = await UserModel.create(name.trim(), email, password);
    const token = generateToken(user.id);

    return res.status(201).json({
      success : true,
      message : 'Account created successfully!',
      data    : { user, token },
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login  — Authenticate and get JWT
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // ── Find User ─────────────────────────────────────────────
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // ── Check Password ────────────────────────────────────────
    const isMatch = await UserModel.validatePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token    = generateToken(user.id);
    const safeUser = UserModel.toSafeObject(user);

    return res.status(200).json({
      success : true,
      message : 'Login successful!',
      data    : { user: safeUser, token },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/profile  — Get current user (protected)
// ─────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    // req.user is attached by authMiddleware after JWT verification
    return res.status(200).json({
      success : true,
      data    : { user: req.user },
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { register, login, getProfile };
