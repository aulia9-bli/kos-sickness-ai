import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';

// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY tidak ditemukan di file .env');
  console.error('Silakan tambahkan GROQ_API_KEY ke file .env');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusColor} [${new Date().toLocaleTimeString()}] ${req.method.padEnd(6)} ${req.path.padEnd(30)} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Request body size limit middleware
app.use((req, res, next) => {
  if (req.body && JSON.stringify(req.body).length > 50000) {
    return res.status(413).json({
      success: false,
      message: 'Payload terlalu besar. Maksimal 50KB',
    });
  }
  next();
});

// Routes
app.use('/api', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    app: {
      name: 'Kos-Sickness API',
      version: '1.0.0',
      description: 'Konsultasi kesehatan AI untuk mahasiswa kos',
    },
    endpoints: {
      health: 'GET /api/health',
      appInfo: 'GET /api/app-info',
      analyzeSickness: 'POST /api/analyze-sickness',
    },
    status: 'ready',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    requestedPath: req.path,
    method: req.method,
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🏥 KOS-SICKNESS API SERVER                    ║
║                                                  ║
║   Status: ✅ RUNNING                            ║
║   Port: ${PORT}                                      ║
║   Environment: ${NODE_ENV}                  ║
║   Groq Model: llama-3.1-8b-instant              ║
║                                                  ║
╚══════════════════════════════════════════════════╝

📍 Base URL: http://localhost:${PORT}
📚 API Documentation:
   • GET  http://localhost:${PORT}
   • GET  http://localhost:${PORT}/api/health
   • GET  http://localhost:${PORT}/api/app-info
   • POST http://localhost:${PORT}/api/analyze-sickness

🔗 CORS Enabled: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}
  `);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} sudah digunakan. Ubah PORT di file .env`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;
