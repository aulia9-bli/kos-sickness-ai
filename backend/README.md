# Kos-Sickness Backend API

Backend API untuk aplikasi konsultasi kesehatan mahasiswa kos menggunakan Groq AI dan Express.js

## Fitur

- ✅ Integrasi Groq AI dengan model llama-3.1-8b-instant
- ✅ REST API endpoint untuk analisis gejala kesehatan
- ✅ Validasi input yang komprehensif
- ✅ Error handling yang baik
- ✅ Siap untuk deployment (Vercel, Render)
- ✅ CORS configuration

## Persyaratan

- Node.js v16 atau lebih tinggi
- npm atau yarn
- Groq API Key (dapatkan dari https://groq.com)

## Setup

1. **Clone/Download project**

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

4. **Update .env dengan Groq API Key Anda**
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

5. **Jalankan server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Response:
```json
{
  "success": true,
  "message": "Server berjalan dengan baik",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Analyze Sickness
```
POST /api/analyze-sickness
Content-Type: application/json

{
  "complaint": "Saya mengalami sakit kepala dan demam tinggi sejak kemarin"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "complaint": "Saya mengalami sakit kepala dan demam tinggi sejak kemarin",
    "advice": "Berdasarkan gejala yang Anda alami, ini mungkin flu atau demam biasa...",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel deploy
```

3. Setup environment variables di Vercel dashboard

### Render

1. Connect repository ke Render
2. Setup environment variables
3. Deploy dengan command:
```bash
npm install && npm start
```

## Struktur Project

```
backend/
├── src/
│   ├── config/
│   │   └── groq.js          # Groq client configuration
│   ├── controllers/
│   │   └── sicknessController.js  # Business logic
│   ├── middleware/
│   │   └── validators.js    # Input validation
│   ├── routes/
│   │   └── health.js        # API routes
│   └── server.js            # Express server setup
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md              # Documentation
```

## Troubleshooting

### GROQ_API_KEY tidak valid
- Pastikan API key sudah benar di file `.env`
- Cek di dashboard Groq apakah API key sudah active

### CORS Error
- Update `CORS_ORIGIN` di `.env` sesuai dengan URL frontend Anda

### Port sudah digunakan
- Ubah nilai `PORT` di `.env` ke port yang tersedia

## Development

Untuk development dengan auto-reload:
```bash
npm run dev
```

Pastikan sudah install `nodemon` di devDependencies.
