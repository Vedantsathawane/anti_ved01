// controllers/userController.js — User CRUD for dashboard
const userModel = require('../models/userModel');

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id }              = req.params;
    const { name, role, status } = req.body;
    const updated = await userModel.update(id, { name, role, status });
    if (!updated)
      return res.status(404).json({ success: false, message: 'User not found.' });

    // Log activity
    await userModel.logActivity({
      userId: req.user.id, userName: req.user.name || 'Admin',
      userEmail: req.user.email, action: `Updated user #${id} (${role || status})`,
      type: 'update', ip: req.ip,
    });

    res.json({ success: true, message: 'User updated.', user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id)
      return res.status(400).json({ success: false, message: "You can't delete your own account." });

    const deleted = await userModel.delete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
