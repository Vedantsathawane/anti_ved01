// models/userModel.js — All user-related DB queries
const { pool } = require('../config/db');
const bcrypt   = require('bcryptjs');

const userModel = {
  // Find user by email (for login)
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Find user by ID (for profile/auth)
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  // Create new user
  async create({ name, email, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    return { id: result.insertId, name, email, role: 'user', status: 'active' };
  },

  // Get all users (for admin dashboard)
  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  // Update user role or status
  async update(id, { name, role, status }) {
    const fields = [];
    const vals   = [];
    if (name)   { fields.push('name = ?');   vals.push(name);   }
    if (role)   { fields.push('role = ?');   vals.push(role);   }
    if (status) { fields.push('status = ?'); vals.push(status); }
    if (!fields.length) return null;
    vals.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, vals);
    return userModel.findById(id);
  },

  // Delete user
  async delete(id) {
    await pool.query('DELETE FROM activity_logs WHERE user_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Verify password
  async verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },

  // Log activity
  async logActivity({ userId, userName, userEmail, action, type, ip }) {
    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, user_email, action, type, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, userName, userEmail, action, type, ip || '127.0.0.1']
    );
  },
};

module.exports = userModel;
