// config/jwt.js
module.exports = {
  secret    : process.env.JWT_SECRET || 'antigravitywebapp1_jwt_secret_2024',
  expiresIn : '7d',
};
