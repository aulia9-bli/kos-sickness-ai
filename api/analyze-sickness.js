import { withCors, successResponse, errorResponse } from './utils/cors.js';
import { validateComplaint } from './utils/validators.js';
import { getGroqClient, SYSTEM_PROMPTS, handleGroqError, validateGroqResponse } from './utils/groq.js';
import { logRequest, logResponse, logError, safeLog } from './utils/logger.js';

/**
 * Analyze Sickness Endpoint
 * POST /api/analyze-sickness
 *
 * Menganalisis keluhan kesehatan menggunakan Groq AI dan memberikan saran pertolongan pertama
 * Body: { complaint: string }
 */
const handler = async (req, res) => {
  const startTime = Date.now();
  const endpoint = 'analyze-sickness';

  // Log incoming request
  logRequest(req, endpoint);

  try {
    const { complaint } = req.body || {};

    // Validate complaint
    const validation = validateComplaint(complaint);
    if (!validation.valid) {
      const duration = Date.now() - startTime;
      errorResponse(res, validation.status, validation.message);
      logResponse(validation.status, 'Validation failed', endpoint, duration);
      return;
    }

    // Initialize Groq client
    let groqClient;
    try {
      groqClient = getGroqClient();
    } catch (error) {
      const duration = Date.now() - startTime;
      errorResponse(res, 401, 'GROQ_API_KEY tidak dikonfigurasi. Hubungi administrator.');
      logError('Groq client initialization failed', error, endpoint);
      logResponse(401, 'Groq client init error', endpoint, duration);
      return;
    }

    // Call Groq API with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    let message;
    try {
      message = await groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS.sicknesAnalyzer,
          },
          {
            role: 'user',
            content: `Pasien (mahasiswa kos) melaporkan: "${complaint}"\n\nBerikan saran pertolongan pertama yang SPESIFIK dan PRAKTIS untuk situasi mahasiswa kos, dengan mempertimbangkan keterbatasan budget dan fasilitas.`,
          },
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
      });

      clearTimeout(timeoutId);
    } catch (groqError) {
      clearTimeout(timeoutId);
      const errorInfo = handleGroqError(groqError);
      const duration = Date.now() - startTime;
      errorResponse(res, errorInfo.statusCode, errorInfo.message);
      logError('Groq API error', groqError, endpoint);
      logResponse(errorInfo.statusCode, 'Groq API error', endpoint, duration);
      return;
    }

    // Validate Groq response
    const groqValidation = validateGroqResponse(message);
    if (!groqValidation.valid) {
      const duration = Date.now() - startTime;
      errorResponse(res, 502, 'Groq API mengembalikan response yang tidak valid.');
      logError('Invalid Groq response', new Error(groqValidation.message), endpoint);
      logResponse(502, 'Invalid Groq response', endpoint, duration);
      return;
    }

    const advice = groqValidation.content;
    const duration = Date.now() - startTime;

    // Send success response
    successResponse(res, {
      data: {
        complaint,
        advice,
        model: 'mixtral-8x7b-32768',
        processingTimeMs: duration,
      },
    });

    logResponse(200, 'Sickness analysis successful', endpoint, duration, {
      complaintLength: complaint.length,
      adviceLength: advice.length,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Unexpected error in analyze-sickness', error, endpoint);
    errorResponse(res, 500, 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.');
    logResponse(500, 'Unexpected error', endpoint, duration);
  }
};

// Wrap handler dengan CORS support hanya untuk POST requests
export default withCors(handler, ['POST']);

  }
}
