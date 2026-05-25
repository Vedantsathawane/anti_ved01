// models/userModel.js — User Model (MySQL)
// All database queries live here — this is the Model layer in MVC

const bcrypt    = require('bcryptjs');
const { pool }  = require('../config/db');

const UserModel = {

  /**
   * Find a user by email address.
   * @param {string} email
   * @returns {Object|null}
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by their ID.
   * @param {number} id
   * @returns {Object|null}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user with a hashed password.
   * @param {string} name
   * @param {string} email
   * @param {string} plainPassword
   * @returns {Object} The created user (without password)
   */
  async create(name, email, plainPassword) {
    // Hash the password before saving
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword]
    );

    // Fetch the newly created user and return without password
    const newUser = await this.findById(result.insertId);
    return this.toSafeObject(newUser);
  },

  /**
   * Compare a plain-text password against the stored hash.
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Strip the password field before returning user data to the client.
   * @param {Object} user
   * @returns {Object}
   */
  toSafeObject(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },
};

module.exports = UserModel;
