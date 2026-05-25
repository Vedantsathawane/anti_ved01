// config/jwt.js — JWT configuration
module.exports = {
  secret: process.env.JWT_SECRET || 'auth_app_super_secret_key_2024',
  expiresIn: '7d',
};
