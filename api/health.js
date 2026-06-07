import { withCors, successResponse } from './utils/cors.js';
import { logRequest, logResponse } from './utils/logger.js';

/**
 * Health check endpoint
 * GET /api/health
 *
 * Verifikasi bahwa API berjalan dengan baik
 */
const handler = (req, res) => {
  const startTime = Date.now();
  const endpoint = 'health';

  // Log request
  logRequest(req, endpoint);

  // Return health status
  const duration = Date.now() - startTime;

  successResponse(res, {
    message: 'Server berjalan dengan baik ✅',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });

  logResponse(200, 'Health check successful', endpoint, duration);
};

// Wrap handler dengan CORS support hanya untuk GET requests
export default withCors(handler, ['GET']);

