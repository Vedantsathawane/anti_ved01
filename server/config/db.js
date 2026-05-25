// config/db.js — MySQL Database Connection Pool
// Uses mysql2/promise for full async/await support

const mysql = require('mysql2/promise');

// ── Database Configuration ────────────────────────────────────
// 🔧 Update host, user, password to match your MySQL setup
const dbConfig = {
  host     : 'localhost',
  port     : 3306,
  user     : 'root',          // MySQL username
  password : 'root',          // MySQL password
  database : 'antigrav-users',
  waitForConnections : true,
  connectionLimit    : 10,
  queueLimit         : 0,
};

// Create a connection pool (reuses connections — more efficient)
const pool = mysql.createPool(dbConfig);

/**
 * Test the database connection on server startup.
 * Exits the process if connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected  →  database: antigrav-users');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('👉 Check: Is MySQL running? Are credentials correct in config/db.js?');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
