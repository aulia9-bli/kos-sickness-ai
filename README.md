# Kos-Sickness - Konsultasi Kesehatan Mahasiswa Kos

Aplikasi web untuk membantu mahasiswa yang tinggal di kos mendapatkan konsultasi kesehatan untuk gejala sakit ringan menggunakan AI (Groq).

![Project Structure](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20Tailwind-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

## 🎯 Fitur Utama

- 🤖 **AI-Powered Health Consultation**: Menggunakan Groq AI dengan model llama-3.1-8b-instant
- 💬 **Smart Health Analysis**: Analisis gejala dan memberikan saran pertolongan pertama
- 📱 **Responsive Design**: Tampilan yang sempurna di semua device
- 🔐 **Secure API**: Environment variables untuk menyimpan API key dengan aman
- 🚀 **Ready for Deployment**: Siap di-deploy ke Vercel atau Render

## 📋 Persyaratan

- Node.js v16 atau lebih tinggi
- npm atau yarn
- Groq API Key (dapatkan dari https://console.groq.com)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/kos-sickness.git
cd kos-sickness
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env dan tambahkan GROQ_API_KEY Anda
npm install
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend (di terminal terpisah)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📁 Struktur Project

```
kos-sickness/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── groq.js              # Groq client configuration
│   │   ├── controllers/
│   │   │   └── sicknessController.js # Business logic
│   │   ├── middleware/
│   │   │   └── validators.js         # Input validation
│   │   ├── routes/
│   │   │   └── health.js             # API routes
│   │   └── server.js                # Express server
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SicknessForm.jsx
│   │   │   └── AdviceResult.jsx
│   │   ├── services/
│   │   │   └── apiClient.js         # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── vercel.json                      # Vercel deployment config
├── render.yaml                      # Render deployment config
└── README.md
```

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Server berjalan dengan baik"
}
```

### Analyze Sickness
```
POST /api/analyze-sickness
Content-Type: application/json

{
  "complaint": "Saya mengalami sakit kepala dan demam"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "complaint": "Saya mengalami sakit kepala dan demam",
    "advice": "Berdasarkan gejala yang Anda alami...",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🌐 Deployment

### Vercel

1. **Push ke GitHub**
```bash
git push origin main
```

2. **Import Project ke Vercel**
   - Kunjungi https://vercel.com
   - Klik "New Project"
   - Connect GitHub repository

3. **Setup Environment Variables**
   - Klik "Settings" → "Environment Variables"
   - Tambahkan `GROQ_API_KEY`

4. **Deploy**
   - Vercel akan otomatis deploy ketika ada push

### Render

1. **Push ke GitHub**

2. **Deploy Manual**
```bash
vercel login
vercel deploy
```

3. **Setup di Dashboard Render**
   - Create new Web Service
   - Connect GitHub repository
   - Set Build Command:
     ```
     cd backend && npm install
     ```
   - Set Start Command:
     ```
     npm start
     ```
   - Add Environment Variables:
     - `GROQ_API_KEY`: Your Groq API Key
     - `NODE_ENV`: production

## 🔐 Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Kos-Sickness
```

## 💻 Tech Stack

### Backend
- **Express.js**: Web framework
- **Groq SDK**: AI integration
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variables

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling framework
- **Axios**: HTTP client

## 📝 Catatan Development

### Untuk Testing API

Gunakan curl atau Postman:
```bash
curl -X POST http://localhost:5000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya mengalami sakit kepala dan demam tinggi"}'
```

### Troubleshooting

1. **GROQ_API_KEY tidak valid**
   - Pastikan API key sudah benar
   - Cek di https://console.groq.com

2. **CORS Error**
   - Pastikan `CORS_ORIGIN` di backend sesuai dengan URL frontend

3. **Port sudah digunakan**
   - Ubah PORT di `.env` backend
   - Ubah port di `vite.config.js` frontend

## 📚 Dokumentasi Lengkap

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 📧 Support

Untuk bantuan atau pertanyaan, silakan buat issue di GitHub.

## 📄 Lisensi

ISC

---

**Dibuat untuk UTS AI Project** 🎓

Selamat mengerjakan! 🚀
