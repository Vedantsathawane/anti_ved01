// controllers/statsController.js — Dashboard analytics & stats
const statsModel = require('../models/statsModel');

// GET /api/stats/overview
const getOverview = async (req, res) => {
  try {
    const data = await statsModel.getOverview();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/stats/monthly
const getMonthly = async (req, res) => {
  try {
    const data = await statsModel.getMonthly();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/stats/activity
const getActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data  = await statsModel.getActivity(limit);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/stats/traffic
const getTraffic = async (req, res) => {
  try {
    const data = await statsModel.getTrafficSources();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/stats/roles
const getRoles = async (req, res) => {
  try {
    const data = await statsModel.getRoleDistribution();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getOverview, getMonthly, getActivity, getTraffic, getRoles };
