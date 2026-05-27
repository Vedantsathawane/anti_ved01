// controllers/authController.js — Login, Register, Profile
const jwt       = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const userModel = require('../models/userModel');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    // Check duplicate
    const existing = await userModel.findByEmail(email);
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    // Create user
    const user  = await userModel.create({ name, email, password });
    const token = jwt.sign({ id: user.id, email: user.email }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    // Log activity
    await userModel.logActivity({
      userId: user.id, userName: user.name, userEmail: user.email,
      action: 'Registered a new account', type: 'register',
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await userModel.findByEmail(email);
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (user.status === 'inactive')
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });

    const valid = await userModel.verifyPassword(password, user.password);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    // Log activity
    await userModel.logActivity({
      userId: user.id, userName: user.name, userEmail: user.email,
      action: `Logged in from ${req.headers['x-forwarded-for'] || req.ip}`,
      type: 'login', ip: req.ip,
    });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// GET /api/auth/profile  (protected)
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to get profile.' });
  }
};

module.exports = { register, login, getProfile };
