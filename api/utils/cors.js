/**
 * CORS Middleware Utility untuk Vercel Serverless Functions
 * Handles CORS headers dan preflight requests
 */

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://kos-sickness.vercel.app',
];

/**
 * Set CORS headers untuk response
 * @param {Object} res - Vercel Response object
 * @param {String} origin - Request origin
 */
export const setCorsHeaders = (res, origin = '*') => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : process.env.CORS_ORIGIN === 'auto'
      ? origin
      : ALLOWED_ORIGINS[2]; // Default ke production URL

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version,Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
};

/**
 * Handle CORS preflight requests
 * @param {Object} req - Vercel Request object
 * @param {Object} res - Vercel Response object
 * @returns {Boolean} true jika request adalah preflight
 */
export const handleCorsPreFlight = (req, res) => {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, req.headers.origin);
    res.status(200).end();
    return true;
  }
  return false;
};

/**
 * Middleware wrapper untuk menangani CORS otomatis
 * @param {Function} handler - Vercel handler function
 * @param {Array} allowedMethods - Array of allowed HTTP methods
 * @returns {Function} Wrapped handler function
 */
export const withCors = (handler, allowedMethods = ['GET', 'POST']) => {
  return async (req, res) => {
    // Set CORS headers untuk semua requests
    setCorsHeaders(res, req.headers.origin);

    // Handle preflight
    if (handleCorsPreFlight(req, res)) {
      return;
    }

    // Check method allowed
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} tidak diizinkan. Gunakan ${allowedMethods.join(', ')}.`,
        allowedMethods,
        timestamp: new Date().toISOString(),
      });
    }

    // Call the actual handler
    return handler(req, res);
  };
};

/**
 * Utility untuk error response
 * @param {Object} res - Vercel Response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} data - Additional error data
 */
export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', data = {}) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Utility untuk success response
 * @param {Object} res - Vercel Response object
 * @param {Object} data - Response data
 * @param {Number} statusCode - HTTP status code (default 200)
 */
export const successResponse = (res, data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...data,
    timestamp: new Date().toISOString(),
  });
};
