import express from 'express';
import { analyzeSickness, getAppInfo } from '../controllers/sicknessController.js';
import { validateInput } from '../middleware/validators.js';

const router = express.Router();

// POST endpoint untuk menganalisis keluhan kesehatan
router.post('/analyze-sickness', validateInput, analyzeSickness);

// GET endpoint untuk informasi aplikasi
router.get('/app-info', getAppInfo);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server berjalan dengan baik ✅',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
