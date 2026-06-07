/**
 * Logging Utilities untuk Vercel Serverless Functions
 * Log requests dan responses dengan format yang konsisten
 */

const LogLevels = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * Format timestamp untuk logs
 * @returns {String} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Color codes untuk terminal output
 */
const Colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Get color untuk log level
 * @param {String} level - Log level
 * @returns {String} Color code
 */
const getColorForLevel = (level) => {
  switch (level) {
    case LogLevels.ERROR:
      return Colors.red;
    case LogLevels.WARN:
      return Colors.yellow;
    case LogLevels.INFO:
      return Colors.green;
    case LogLevels.DEBUG:
      return Colors.blue;
    default:
      return Colors.reset;
  }
};

/**
 * Log message dengan level
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} data - Additional data (optional)
 */
export const log = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const color = getColorForLevel(level);

  let logMessage = `${color}[${timestamp}] [${level}] ${message}${Colors.reset}`;

  if (data) {
    logMessage += `\n${JSON.stringify(data, null, 2)}`;
  }

  console.log(logMessage);
};

/**
 * Log request details
 * @param {Object} req - Vercel Request object
 * @param {String} endpoint - API endpoint name
 */
export const logRequest = (req, endpoint) => {
  const method = req.method;
  const path = req.url;
  const query = JSON.stringify(req.query || {});

  log(LogLevels.INFO, `Incoming ${method} request`, {
    endpoint,
    method,
    path,
    query: query !== '{}' ? JSON.parse(query) : null,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? '***' : 'none',
      'user-agent': req.headers['user-agent'],
    },
  });
};

/**
 * Log response details
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {String} endpoint - API endpoint name
 * @param {Number} duration - Request duration in ms
 * @param {Object} data - Response data (optional)
 */
export const logResponse = (statusCode, message, endpoint, duration, data = null) => {
  const level = statusCode >= 400 ? LogLevels.ERROR : LogLevels.INFO;
  const statusEmoji = statusCode >= 400 ? '❌' : '✅';

  log(level, `${statusEmoji} [${endpoint}] Response ${statusCode} - ${message} (${duration}ms)`, data);
};

/**
 * Log error details
 * @param {String} message - Error message
 * @param {Error} error - Error object
 * @param {String} endpoint - API endpoint name
 */
export const logError = (message, error, endpoint) => {
  log(LogLevels.ERROR, `Error in ${endpoint}: ${message}`, {
    errorName: error.name,
    errorMessage: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

/**
 * Create request logger middleware
 * @param {String} endpoint - API endpoint name
 * @returns {Function} Middleware function
 */
export const createRequestLogger = (endpoint) => {
  return (req, res, next) => {
    const startTime = Date.now();

    logRequest(req, endpoint);

    // Wrap res.end to log response
    const originalEnd = res.end;
    res.end = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      logResponse(statusCode, 'Response completed', endpoint, duration);

      originalEnd.call(this, data);
    };

    return next?.();
  };
};

/**
 * Safe log object (redact sensitive data)
 * @param {Object} obj - Object to log
 * @returns {Object} Object with sensitive data redacted
 */
export const safeLog = (obj) => {
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
  const result = JSON.parse(JSON.stringify(obj));

  const redact = (o) => {
    Object.keys(o).forEach((key) => {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
        o[key] = '***REDACTED***';
      } else if (typeof o[key] === 'object' && o[key] !== null) {
        redact(o[key]);
      }
    });
  };

  redact(result);
  return result;
};
