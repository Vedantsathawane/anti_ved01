// server.js — Express Application Entry Point
require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const { connectDB } = require('./config/db');
const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const statsRoutes   = require('./routes/statsRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Dynamically allow any localhost port or any Vercel deployment URL
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:');
    const isVercel = origin.endsWith('.vercel.app');
    
    if (isLocal || isVercel || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Welcome to the AuthVault API!',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api/health'
  });
});

app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ AuthVault API is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/profile',
      'GET  /api/users',
      'PUT  /api/users/:id',
      'DELETE /api/users/:id',
      'GET  /api/stats/overview',
      'GET  /api/stats/monthly',
      'GET  /api/stats/activity',
      'GET  /api/stats/traffic',
      'GET  /api/stats/roles',
    ],
  });
});

app.use('*', (req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Serverless & local startup management
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on  http://localhost:${PORT}`);
      console.log(`📡 Health check:      http://localhost:${PORT}/api/health\n`);
    });
  };
  startServer();
} else {
  // Call DB connection asynchronously in Vercel to prevent blocking function startup
  connectDB().catch((err) => console.error("Database connection failed in serverless:", err.message));
}

module.exports = app;
