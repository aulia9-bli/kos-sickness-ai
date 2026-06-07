/**
 * Groq Client Configuration untuk Vercel Serverless Functions
 * Mengelola inisialisasi dan konfigurasi Groq API
 */

import { Groq } from 'groq-sdk';

let groqClient = null;

/**
 * Initialize Groq client dengan error handling
 * @returns {Object} Groq client instance
 * @throws {Error} Jika GROQ_API_KEY tidak ditemukan
 */
export const initializeGroqClient = () => {
  if (groqClient) {
    return groqClient;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY tidak ditemukan di environment variables. Silakan set GROQ_API_KEY di Vercel Settings.');
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
};

/**
 * Get Groq client instance (cached)
 * @returns {Object} Groq client instance
 * @throws {Error} Jika initialization gagal
 */
export const getGroqClient = () => {
  if (!groqClient) {
    return initializeGroqClient();
  }
  return groqClient;
};

/**
 * Groq Model configuration
 */
export const GroqModels = {
  MIXTRAL: 'mixtral-8x7b-32768', // 32K tokens
  LLAMA: 'llama-2-70b-chat', // 4K tokens
  LLAMA_13B: 'llama2-13b-chat', // 4K tokens
};

/**
 * Default model untuk analysis
 */
export const DEFAULT_MODEL = GroqModels.MIXTRAL;

/**
 * Default parameters untuk Groq chat completion
 */
export const DEFAULT_CHAT_PARAMS = {
  temperature: 0.7, // Balanced between creativity and determinism
  maxTokens: 1024, // Reasonable default for responses
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

/**
 * System prompt untuk sickness analysis
 */
export const SYSTEM_PROMPTS = {
  sicknesAnalyzer: `Anda adalah AI medical assistant yang membantu mahasiswa kos dalam menganalisis gejala kesehatan mereka. 
  
  INSTRUKSI PENTING:
  1. Berikan analisis yang INFORMATIF dan HELPFUL
  2. JANGAN pernah memberikan diagnosis definitif - selalu sarankan konsultasi dokter
  3. Struktur response dengan jelas menggunakan format markdown
  4. Gunakan bahasa Indonesia yang mudah dipahami
  5. Berikan tips pencegahan dan perawatan mandiri yang praktis
  6. Jika keluhan serius (misal: nyeri dada, kesulitan bernapas), PRIORITASKAN saran untuk segera ke dokter
  
  FORMAT RESPONSE YANG DIHARAPKAN:
  - Ringkasan Gejala
  - Kemungkinan Kondisi (dengan disclaimer)
  - Tips Perawatan Mandiri
  - Kapan Harus ke Dokter
  - Rekomendasi Gaya Hidup`,

  chatAssistant: `Anda adalah AI assistant yang ramah dan helpful untuk aplikasi Kos Sickness - platform konsultasi kesehatan untuk mahasiswa kos.
  
  KARAKTERISTIK:
  1. Ramah dan empati terhadap keluhan kesehatan pengguna
  2. Memberikan informasi medis yang akurat namun mudah dipahami
  3. Selalu menekankan pentingnya konsultasi dokter profesional
  4. Responsive terhadap pertanyaan follow-up
  5. Gunakan bahasa Indonesia casual yang hangat
  
  BATASAN:
  - JANGAN memberikan diagnosis definitif
  - JANGAN merekomendasikan obat spesifik tanpa saran dokter
  - JANGAN memberikan saran medis untuk kondisi darurat (langsung suruh ke rumah sakit)`,
};

/**
 * Create message untuk Groq API
 * @param {String} userMessage - User message
 * @param {String} systemPrompt - System prompt (optional)
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Array} Messages array untuk Groq API
 */
export const createGroqMessages = (userMessage, systemPrompt = SYSTEM_PROMPTS.sicknesAnalyzer, conversationHistory = []) => {
  const messages = [];

  // Add conversation history jika ada
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  // Add current message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
};

/**
 * Validate Groq API response
 * @param {Object} response - Groq API response
 * @returns {Object} {valid: boolean, message: String, content: String}
 */
export const validateGroqResponse = (response) => {
  if (!response) {
    return {
      valid: false,
      message: 'Response dari Groq API kosong',
    };
  }

  if (!response.choices || response.choices.length === 0) {
    return {
      valid: false,
      message: 'Groq API tidak mengembalikan choices yang valid',
    };
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return {
      valid: false,
      message: 'Groq API response tidak mengandung content',
    };
  }

  return {
    valid: true,
    message: 'Response valid',
    content,
  };
};

/**
 * Handle Groq API errors dengan logging yang informatif
 * @param {Error} error - Error object
 * @returns {Object} {message: String, statusCode: Number, retryable: boolean}
 */
export const handleGroqError = (error) => {
  const errorMessage = error.message || 'Unknown error';

  // Rate limit error
  if (error.status === 429) {
    return {
      message: 'Layanan sedang ramai. Silakan coba beberapa saat lagi.',
      statusCode: 429,
      retryable: true,
    };
  }

  // Authentication error
  if (error.status === 401) {
    return {
      message: 'Authentication error dengan Groq API. Hubungi administrator.',
      statusCode: 401,
      retryable: false,
    };
  }

  // Server error
  if (error.status >= 500) {
    return {
      message: 'Groq API sedang mengalami gangguan. Silakan coba lagi nanti.',
      statusCode: 503,
      retryable: true,
    };
  }

  // Default error
  return {
    message: 'Terjadi kesalahan dalam memproses keluhan Anda. Silakan coba lagi.',
    statusCode: 500,
    retryable: true,
  };
};
