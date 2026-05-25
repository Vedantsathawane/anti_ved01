// server.js — Express Application Entry Point
const express         = require('express');
const cors            = require('cors');
const { connectDB }   = require('./config/db');
const authRoutes      = require('./routes/authRoutes');

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin     : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running ✅', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ── Start Server (connect DB first) ──────────────────────────
const startServer = async () => {
  await connectDB();   // Connect to MySQL before accepting requests

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on  http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/profile  (protected)\n`);
  });
};

startServer();

module.exports = app;
