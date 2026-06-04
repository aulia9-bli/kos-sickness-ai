import { getGroqClient } from '../config/groq.js';

export const analyzeSickness = async (req, res) => {
  const { complaint } = req.body;

  try {
    // Validasi input
    if (!complaint || complaint.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Keluhan tidak boleh kosong',
      });
    }

    // Get Groq client (lazy loaded)
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

    // Panggil Groq API dengan timeout protection
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
};

// Endpoint untuk mendapatkan info aplikasi dan status
export const getAppInfo = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      app: {
        name: 'Kos-Sickness',
        version: '1.0.0',
        description: 'Konsultasi kesehatan AI untuk mahasiswa kos',
      },
      server: {
        status: 'running',
        environment: process.env.NODE_ENV,
        port: process.env.PORT,
      },
      ai: {
        provider: 'Groq',
        model: 'llama-3.1-8b-instant',
        status: 'ready',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting app info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting app info',
    });
  }
};

