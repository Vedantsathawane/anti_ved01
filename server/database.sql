-- ============================================================
--  antigrav-users  —  MySQL Setup Script
--  Run this in MySQL Workbench or mysql CLI BEFORE npm start
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS `antigrav-users`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Step 2: Use the database
USE `antigrav-users`;

-- Step 3: Create users table
CREATE TABLE IF NOT EXISTS users (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Useful queries for testing / debugging
-- ============================================================

-- View all registered users (no password shown)
-- SELECT id, name, email, created_at FROM users;

-- Find user by email
-- SELECT id, name, email, created_at FROM users WHERE email = 'test@example.com';

-- Find user by ID
-- SELECT id, name, email, created_at FROM users WHERE id = 1;

-- Count total users
-- SELECT COUNT(*) AS total_users FROM users;

-- Delete a specific user
-- DELETE FROM users WHERE id = 1;

-- Clear all users (reset)
-- TRUNCATE TABLE users;

-- Drop the table completely
-- DROP TABLE IF EXISTS users;

-- Drop the database completely
-- DROP DATABASE IF EXISTS `antigrav-users`;
