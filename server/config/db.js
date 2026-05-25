// config/db.js — MySQL Database Connection Pool
const mysql = require('mysql2/promise');

const dbConfig = {
  host     : process.env.DB_HOST     || 'localhost',
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || 'root',
  password : process.env.DB_PASSWORD || 'root',
  database : process.env.DB_NAME     || 'antigrav-users',
  waitForConnections : true,
  connectionLimit    : 10,
  queueLimit         : 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
};

const pool = mysql.createPool(dbConfig);

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL connected  →  database: ${dbConfig.database}`);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('👉 Check your DB credentials in environment variables.');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
