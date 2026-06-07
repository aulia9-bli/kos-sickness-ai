import { withCors, successResponse, errorResponse } from './utils/cors.js';
import { getGroqClient, SYSTEM_PROMPTS, handleGroqError, validateGroqResponse } from './utils/groq.js';
import { logRequest, logResponse, logError } from './utils/logger.js';

/**
 * Chat Endpoint
 * POST /api/chat
 *
 * Multi-turn conversation dengan AI assistant untuk konsultasi kesehatan
 * Body: { message: string, conversationId?: string, history?: Array }
 */
const handler = async (req, res) => {
  const startTime = Date.now();
  const endpoint = 'chat';

  // Log incoming request
  logRequest(req, endpoint);

  try {
    const { message, conversationId, history } = req.body || {};

    // Validate message field
    if (!message) {
      const duration = Date.now() - startTime;
      errorResponse(res, 400, 'Field "message" diperlukan dalam request body');
      logResponse(400, 'Missing message field', endpoint, duration);
      return;
    }

    if (typeof message !== 'string') {
      const duration = Date.now() - startTime;
      errorResponse(res, 400, 'Field "message" harus berupa string');
      logResponse(400, 'Invalid message type', endpoint, duration);
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      const duration = Date.now() - startTime;
      errorResponse(res, 400, 'Pesan tidak boleh kosong atau hanya berisi spasi');
      logResponse(400, 'Empty message', endpoint, duration);
      return;
    }

    if (trimmedMessage.length > 2000) {
      const duration = Date.now() - startTime;
      errorResponse(res, 400, 'Pesan terlalu panjang. Maksimal 2000 karakter');
      logResponse(400, 'Message too long', endpoint, duration);
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

    // Prepare messages with conversation history
    const messages = [];

    // Add previous conversation history jika ada
    if (history && Array.isArray(history) && history.length > 0) {
      // Limit history to last 10 messages untuk menghindari token overload
      const limitedHistory = history.slice(-10);
      messages.push(...limitedHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: trimmedMessage,
    });

    // Call Groq API with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    let response;
    try {
      response = await groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS.chatAssistant,
          },
          ...messages,
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
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
    const groqValidation = validateGroqResponse(response);
    if (!groqValidation.valid) {
      const duration = Date.now() - startTime;
      errorResponse(res, 502, 'Groq API mengembalikan response yang tidak valid.');
      logError('Invalid Groq response', new Error(groqValidation.message), endpoint);
      logResponse(502, 'Invalid Groq response', endpoint, duration);
      return;
    }

    const assistantResponse = groqValidation.content;
    const duration = Date.now() - startTime;

    // Send success response with updated conversation
    successResponse(res, {
      conversationId: conversationId || `conv_${Date.now()}`,
      response: assistantResponse,
      message: trimmedMessage,
      model: 'mixtral-8x7b-32768',
      processingTimeMs: duration,
      historyLength: messages.length,
    });

    logResponse(200, 'Chat response successful', endpoint, duration, {
      messageLength: trimmedMessage.length,
      responseLength: assistantResponse.length,
      historyLength: messages.length,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Unexpected error in chat', error, endpoint);
    errorResponse(res, 500, 'Terjadi kesalahan saat memproses pesan. Silakan coba lagi.');
    logResponse(500, 'Unexpected error', endpoint, duration);
  }
};

// Wrap handler dengan CORS support hanya untuk POST requests
export default withCors(handler, ['POST']);

