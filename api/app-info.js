import { withCors, successResponse } from './utils/cors.js';
import { logRequest, logResponse } from './utils/logger.js';

/**
 * Application Info endpoint
 * GET /api/app-info
 *
 * Mengembalikan informasi lengkap tentang aplikasi
 */
const handler = (req, res) => {
  const startTime = Date.now();
  const endpoint = 'app-info';

  // Log request
  logRequest(req, endpoint);

  try {
    // Return app info
    const duration = Date.now() - startTime;

    successResponse(res, {
      app: {
        name: 'Kos-Sickness API',
        version: '2.0.0',
        description: 'Konsultasi kesehatan AI untuk mahasiswa kos menggunakan Groq LLM',
        author: 'Kos-Sickness Team',
        license: 'MIT',
        repository: 'https://github.com/your-username/kos-sickness',
      },
      server: {
        status: 'running',
        environment: process.env.NODE_ENV || 'production',
        platform: 'Vercel',
        uptime: process.uptime(),
      },
      ai: {
        provider: 'Groq',
        model: 'mixtral-8x7b-32768',
        status: process.env.GROQ_API_KEY ? 'ready' : 'not configured',
      },
      endpoints: {
        health: {
          method: 'GET',
          path: '/api/health',
          description: 'Health check endpoint',
        },
        appInfo: {
          method: 'GET',
          path: '/api/app-info',
          description: 'Application information',
        },
        analyzeSickness: {
          method: 'POST',
          path: '/api/analyze-sickness',
          description: 'Analyze sickness symptoms',
          body: {
            complaint: 'string (required) - Description of symptoms',
          },
        },
        chat: {
          method: 'POST',
          path: '/api/chat',
          description: 'Chat with AI assistant',
          body: {
            message: 'string (required) - User message',
            conversationId: 'string (optional) - For conversation history',
          },
        },
      },
    });

    logResponse(200, 'App info retrieved', endpoint, duration);
  } catch (error) {
    logResponse(500, 'Error retrieving app info', endpoint, Date.now() - startTime);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan dalam mengambil informasi aplikasi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Wrap handler dengan CORS support hanya untuk GET requests
export default withCors(handler, ['GET']);
  } catch (error) {
    console.error('Error getting app info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting app info',
    });
  }
}
