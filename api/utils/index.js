/**
 * API Utilities - Export all utilities for easy importing
 * 
 * Usage:
 *   import { withCors, successResponse } from './utils/index.js';
 *   // or specific imports:
 *   import { withCors } from './utils/cors.js';
 */

export {
  setCorsHeaders,
  handleCorsPreFlight,
  withCors,
  errorResponse,
  successResponse,
} from './cors.js';

export {
  validateJsonBody,
  validateRequiredFields,
  validateComplaint,
  validateEnvVariables,
} from './validators.js';

export {
  log,
  logRequest,
  logResponse,
  logError,
  createRequestLogger,
  safeLog,
} from './logger.js';

export {
  initializeGroqClient,
  getGroqClient,
  GroqModels,
  DEFAULT_MODEL,
  DEFAULT_CHAT_PARAMS,
  SYSTEM_PROMPTS,
  createGroqMessages,
  validateGroqResponse,
  handleGroqError,
} from './groq.js';
