/**
 * Validation Utilities untuk Vercel Serverless Functions
 */

/**
 * Validate JSON request body
 * @param {Object} req - Vercel Request object
 * @returns {Object} {valid: boolean, data: Object, error: String}
 */
export const validateJsonBody = async (req) => {
  try {
    let body = '';
    
    // Collect body chunks
    await new Promise((resolve, reject) => {
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', resolve);
      req.on('error', reject);
    });

    if (!body) {
      return { valid: false, error: 'Request body tidak boleh kosong' };
    }

    try {
      const data = JSON.parse(body);
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  } catch (e) {
    return { valid: false, error: e.message };
  }
};

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} {valid: boolean, missingFields: Array}
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(
    (field) => !data[field] || (typeof data[field] === 'string' && !data[field].trim())
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      missingFields,
      message: `Field berikut diperlukan: ${missingFields.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate complaint field
 * @param {String} complaint - Complaint text
 * @returns {Object} {valid: boolean, message: String, status: Number}
 */
export const validateComplaint = (complaint) => {
  if (complaint === undefined || complaint === null) {
    return {
      valid: false,
      message: 'Field "complaint" diperlukan dalam request body',
      status: 400,
    };
  }

  if (typeof complaint !== 'string') {
    return {
      valid: false,
      message: 'Field "complaint" harus berupa string',
      status: 400,
    };
  }

  const trimmedComplaint = complaint.trim();

  if (trimmedComplaint.length === 0) {
    return {
      valid: false,
      message: 'Keluhan tidak boleh kosong atau hanya berisi spasi',
      status: 400,
    };
  }

  if (trimmedComplaint.length > 2000) {
    return {
      valid: false,
      message: 'Keluhan terlalu panjang. Maksimal 2000 karakter',
      status: 400,
    };
  }

  return {
    valid: true,
    message: 'Validation berhasil',
    status: 200,
  };
};

/**
 * Validate environment variables
 * @param {Array} requiredEnvs - Array of required environment variable names
 * @returns {Object} {valid: boolean, missingEnvs: Array}
 */
export const validateEnvVariables = (requiredEnvs) => {
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    return {
      valid: false,
      missingEnvs,
      message: `Environment variables berikut tidak ditemukan: ${missingEnvs.join(', ')}`,
    };
  }

  return { valid: true };
};
