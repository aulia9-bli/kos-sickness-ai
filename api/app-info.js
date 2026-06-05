// App info endpoint
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan. Gunakan GET.`,
      allowedMethods: ['GET'],
    });
  }

  try {
    return res.status(200).json({
      success: true,
      app: {
        name: 'Kos-Sickness',
        version: '1.0.0',
        description: 'Konsultasi kesehatan AI untuk mahasiswa kos',
        architecture: 'Vercel Serverless Functions',
      },
      server: {
        status: 'running',
        environment: process.env.NODE_ENV || 'production',
        platform: 'Vercel',
      },
      ai: {
        provider: 'Groq',
        model: 'llama-3.1-8b-instant',
        status: process.env.GROQ_API_KEY ? 'ready' : 'not configured',
      },
      endpoints: {
        health: 'GET /api/health',
        appInfo: 'GET /api/app-info',
        analyzeSickness: 'POST /api/analyze-sickness',
        chat: 'POST /api/chat',
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
}
