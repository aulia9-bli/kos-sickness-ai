import { Groq } from 'groq-sdk';

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY tidak ditemukan di environment variables');
  }
  return new Groq({ apiKey });
};

// Validation function
const validateComplaint = (complaint) => {
  if (complaint === undefined) {
    return {
      valid: false,
      message: 'Field "complaint" diperlukan dalam request body',
      requiredFields: ['complaint'],
      status: 400,
    };
  }

  if (typeof complaint !== 'string') {
    return {
      valid: false,
      message: 'Field "complaint" harus berupa string',
      receivedType: typeof complaint,
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

  if (trimmedComplaint.length < 5) {
    return {
      valid: false,
      message: `Keluhan terlalu pendek. Minimal 5 karakter (${trimmedComplaint.length} karakter)`,
      minimumLength: 5,
      currentLength: trimmedComplaint.length,
      status: 400,
    };
  }

  if (trimmedComplaint.length > 2000) {
    return {
      valid: false,
      message: `Keluhan terlalu panjang. Maksimal 2000 karakter (${trimmedComplaint.length} karakter)`,
      maximumLength: 2000,
      currentLength: trimmedComplaint.length,
      status: 400,
    };
  }

  return { valid: true };
};

// Default Vercel handler
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan. Gunakan POST.`,
      allowedMethods: ['POST'],
    });
  }

  const { complaint } = req.body;

  try {
    // Validate input
    const validation = validateComplaint(complaint);
    if (!validation.valid) {
      return res.status(validation.status).json({
        success: false,
        message: validation.message,
        ...(validation.requiredFields && { requiredFields: validation.requiredFields }),
        ...(validation.receivedType && { receivedType: validation.receivedType }),
        ...(validation.minimumLength && { minimumLength: validation.minimumLength }),
        ...(validation.maximumLength && { maximumLength: validation.maximumLength }),
        ...(validation.currentLength && { currentLength: validation.currentLength }),
      });
    }

    // Get Groq client
    const groqClient = getGroqClient();

    const systemPrompt = `Anda adalah konsultan kesehatan profesional yang berpengalaman dalam memberikan saran pertolongan pertama untuk mahasiswa yang tinggal di kos.

PETUNJUK PENTING:
1. Berikan saran dalam Bahasa Indonesia yang jelas, mudah dipahami, dan praktis
2. Fokus pada pertolongan pertama yang DAPAT dilakukan di rumah/kos dengan sumber daya terbatas
3. Berikan informasi spesifik tentang KAPAN HARUS KE DOKTER atau ke rumah sakit
4. Hindari diagnosis medis yang kompleks dan berbahaya
5. Sarankan obat-obatan umum yang tersedia di apotek terdekat
6. Berikan tips pencegahan dan perawatan untuk masa depan
7. Pertimbangkan keterbatasan mahasiswa kos: budget terbatas, fasilitas kesehatan terbatas, diet tidak selalu ideal

FORMAT RESPONS HARUS:
✓ Penjelasan singkat tentang kemungkinan penyakit (1-2 baris)
✓ Langkah-langkah pertolongan pertama yang konkret (3-5 poin dengan nomor/bullet)
✓ Rekomendasi obat atau produk kesehatan dengan estimasi harga
✓ Tanda-tanda bahaya yang memerlukan penanganan medis URGENT
✓ Tips pencegahan untuk masa depan

GAYA PENULISAN:
- Gunakan bahasa yang hangat dan supportif
- Jangan menakut-nakuti pasien
- Berikan solusi praktis dan terjangkau
- Gunakan emojis untuk membuat lebih menarik (minimal)`;

    // Call Groq API with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 detik timeout

    const message = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Pasien (mahasiswa kos) melaporkan: "${complaint}"\n\nBerikan saran pertolongan pertama yang SPESIFIK dan PRAKTIS untuk situasi mahasiswa kos, dengan mempertimbangkan keterbatasan budget dan fasilitas.`,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 0.9,
    });

    clearTimeout(timeoutId);

    const advice = message.choices[0].message.content;

    console.log(`✅ Success: Analyzed complaint - "${complaint.substring(0, 50)}..."`);

    return res.status(200).json({
      success: true,
      data: {
        complaint,
        advice,
        timestamp: new Date().toISOString(),
        model: 'llama-3.1-8b-instant',
      },
    });
  } catch (error) {
    console.error('❌ Error analyzing sickness:', error.message);

    // Handle timeout
    if (error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        message: 'Request timeout. Groq API sedang tidak responsif. Silakan coba lagi.',
      });
    }

    // Handle API key error
    if (error.message.includes('API key') || error.message.includes('authentication')) {
      return res.status(401).json({
        success: false,
        message: 'API Key tidak valid. Silakan periksa konfigurasi GROQ_API_KEY di file .env',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    // Handle rate limit
    if (error.message.includes('rate') || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Terlalu banyak request. Silakan tunggu beberapa saat sebelum mencoba lagi.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
