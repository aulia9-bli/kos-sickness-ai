# Kos-Sickness - Konsultasi Kesehatan Mahasiswa Kos

Aplikasi web untuk membantu mahasiswa yang tinggal di kos mendapatkan konsultasi kesehatan untuk gejala sakit ringan menggunakan AI (Groq). Dibangun dengan **Vercel Serverless Functions** architecture untuk scalability dan cost-efficiency yang optimal.

![Project Structure](https://img.shields.io/badge/Stack-Vercel%20Serverless%20%7C%20React%20%7C%20Tailwind-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![Architecture](https://img.shields.io/badge/Architecture-Serverless-brightgreen)

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

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local dan tambahkan GROQ_API_KEY Anda
```

### 3. Setup Frontend (Vercel Serverless + React Frontend)
```bash
cd frontend
npm install
npm run dev
```

Frontend + Serverless API akan berjalan di `http://localhost:3000`

**Note**: Untuk development lokal dengan Vercel Functions, gunakan Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

## 🔄 Architecture Migration

Proyek ini telah direfactor menjadi **Vercel Serverless Functions**:
- ✅ Backend Express dihapus
- ✅ Gunakan Vercel Functions di `/api/` directory
- ✅ No server, auto-scaling, pay-per-use

Lihat [SERVERLESS_ARCHITECTURE.md](SERVERLESS_ARCHITECTURE.md) untuk dokumentasi lengkap.

## 📁 Struktur Project

```
kos-sickness/
├── api/                            # Vercel Serverless Functions
│   ├── index.js                    # GET / - Root endpoint
│   ├── health.js                   # GET /api/health - Health check
│   ├── app-info.js                 # GET /api/app-info - App info
│   ├── analyze-sickness.js         # POST /api/analyze-sickness - Sickness analysis
│   └── chat.js                     # POST /api/chat - Chat interface
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SicknessForm.jsx
│   │   │   └── AdviceResult.jsx
│   │   ├── services/
│   │   │   └── apiClient.js        # API client untuk serverless
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── README.md
│
├── database/                        # Database documentation
│   ├── kos_sickness_db.sql
│   └── ...
│
├── .env.example                     # Environment variables template
├── .gitignore
├── vercel.json                      # Vercel deployment config
├── SERVERLESS_ARCHITECTURE.md       # Serverless documentation
└── README.md
```

## 🔧 API Endpoints

Semua endpoints adalah **Vercel Serverless Functions** (bukan Express):

### Health Check
```
GET /api/health
```

### App Info
```
GET /api/app-info
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

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "complaint": "Demam tinggi"
}
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

### ⭐ Vercel (Recommended - Serverless Functions)

**Vercel adalah platform terbaik untuk Serverless Functions. Setup sangat mudah!**

1. **Push ke GitHub**
```bash
git add .
git commit -m "Deploy: Vercel Serverless Architecture"
git push origin main
```

2. **Import Project ke Vercel**
   - Buka https://vercel.com/dashboard
   - Klik "New Project"
   - Pilih GitHub repository Anda
   - Klik "Import"

3. **Setup Environment Variables**
   - Buka "Settings" → "Environment Variables"
   - Tambahkan:
     - **Key**: `GROQ_API_KEY`
     - **Value**: API key dari https://console.groq.com
   - Tambahkan:
     - **Key**: `CORS_ORIGIN`
     - **Value**: Frontend URL (auto untuk production)

4. **Deploy**
   - Klik "Deploy"
   - Vercel akan otomatis deploy!
   - Vercel Functions siap diakses

**URL Anda:**
- 🌐 Frontend: `https://your-project.vercel.app`
- 🔗 API: `https://your-project.vercel.app/api/*`

**Auto-Deploy**: Push ke `main` branch akan otomatis deploy ke production

### Local Testing dengan Vercel CLI

```bash
npm install -g vercel

# Login ke Vercel
vercel login

# Run locally
vercel dev
```

## 🔐 Environment Variables

Buat file `.env.local` di root project (atau atur di Vercel Dashboard):

```
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Kos-Sickness
```

## 💻 Tech Stack

### Serverless Functions (Backend)
- **Vercel Functions**: Serverless compute platform
- **Node.js 18+**: Runtime environment
- **Groq SDK**: AI integration (llama-3.1-8b-instant)
- **No Express**: Function-based handlers only

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling framework
- **Axios**: HTTP client

### Infrastructure
- **Vercel**: Deployment platform (Functions + Static hosting)
- **GitHub**: Version control & CI/CD trigger

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
