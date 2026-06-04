export const validateInput = (req, res, next) => {
  const { complaint } = req.body;

  // Check if complaint field exists
  if (complaint === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Field "complaint" diperlukan dalam request body',
      requiredFields: ['complaint'],
    });
  }

  // Check if complaint is string
  if (typeof complaint !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Field "complaint" harus berupa string',
      receivedType: typeof complaint,
    });
  }

  // Check if complaint is not empty after trim
  const trimmedComplaint = complaint.trim();
  if (trimmedComplaint.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Keluhan tidak boleh kosong atau hanya berisi spasi',
    });
  }

  // Check minimum length
  if (trimmedComplaint.length < 5) {
    return res.status(400).json({
      success: false,
      message: `Keluhan terlalu pendek. Minimal 5 karakter (${trimmedComplaint.length} karakter)`,
      minimumLength: 5,
      currentLength: trimmedComplaint.length,
    });
  }

  // Check maximum length
  if (trimmedComplaint.length > 2000) {
    return res.status(400).json({
      success: false,
      message: `Keluhan terlalu panjang. Maksimal 2000 karakter (${trimmedComplaint.length} karakter)`,
      maximumLength: 2000,
      currentLength: trimmedComplaint.length,
    });
  }

  // Check for potentially malicious content
  if (/<script|<iframe|javascript:/i.test(trimmedComplaint)) {
    return res.status(400).json({
      success: false,
      message: 'Input mengandung konten yang tidak diizinkan',
    });
  }

  // Validation passed
  next();
};
