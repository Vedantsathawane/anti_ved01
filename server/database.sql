-- ================================================================
-- AuthVault — Full Database Schema + Sample Data
-- Database: antigrav-users
-- Run this in MySQL Workbench
-- ================================================================

CREATE DATABASE IF NOT EXISTS `antigrav-users`;
USE `antigrav-users`;

-- ── Drop existing tables (clean slate) ───────────────────────
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS monthly_stats;
DROP TABLE IF EXISTS users;

-- ── Users Table ───────────────────────────────────────────────
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('user','manager','admin') DEFAULT 'user',
  status     ENUM('active','inactive')      DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Activity Logs Table ───────────────────────────────────────
CREATE TABLE activity_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  user_name  VARCHAR(100),
  user_email VARCHAR(150),
  action     VARCHAR(255),
  type       ENUM('register','login','update','password','reset','logout') DEFAULT 'login',
  ip_address VARCHAR(50) DEFAULT '127.0.0.1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Monthly Stats Table ───────────────────────────────────────
CREATE TABLE monthly_stats (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  month_name   VARCHAR(10) NOT NULL,
  month_num    INT         NOT NULL,
  year_num     INT         NOT NULL,
  new_users    INT         DEFAULT 0,
  total_logins INT         DEFAULT 0,
  revenue      DECIMAL(10,2) DEFAULT 0.00
);

-- ── Sample Monthly Stats Data ─────────────────────────────────
INSERT INTO monthly_stats (month_name, month_num, year_num, new_users, total_logins, revenue) VALUES
('Jan', 1, 2025, 120,  340,  2400.00),
('Feb', 2, 2025, 185,  520,  3800.00),
('Mar', 3, 2025, 230,  680,  4900.00),
('Apr', 4, 2025, 310,  870,  6200.00),
('May', 5, 2025, 420, 1100,  7800.00),
('Jun', 6, 2025, 510, 1340,  9100.00),
('Jul', 7, 2025, 640, 1620, 11200.00);

-- ================================================================
-- NOTE: Users are inserted by running: npm run seed
-- (in the server/ folder) because passwords must be bcrypt-hashed
-- ================================================================
SELECT 'Tables created successfully!' AS Status;
SELECT 'Now run: cd server && npm run seed' AS NextStep;
