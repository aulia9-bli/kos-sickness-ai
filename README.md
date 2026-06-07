# Kos-Sickness - Konsultasi Kesehatan Mahasiswa Kos

Aplikasi web AI-powered untuk konsultasi kesehatan mahasiswa kos dengan gejala ringan. Dibangun dengan **Vercel Serverless-Only Architecture** untuk optimal scalability, performance, dan cost efficiency.

![Architecture](https://img.shields.io/badge/Architecture-Vercel%20Serverless%20Only-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Groq%20AI-orange)

---

## 🎯 Fitur Utama

- 🤖 **AI-Powered Health Consultation**: Menggunakan Groq AI (Mixtral 8x7B - 32K tokens)
- 💬 **Multi-Turn Conversations**: Support untuk chat history dan contextual responses
- 🏥 **Smart Symptom Analysis**: Analisis gejala dengan saran pertolongan pertama yang praktis
- 📱 **Responsive Design**: Full responsive UI dengan React + Vite + Tailwind CSS
- ⚡ **Serverless-Only Architecture**: No traditional backend server needed
- 🔐 **Enterprise Security**: CORS validation, input validation, security headers
- 📊 **Structured Logging**: Production-grade logging dengan level management
- 🌍 **Global CDN**: Vercel Edge Network untuk performa optimal
- 📈 **Auto-Scaling**: Automatic scaling berdasarkan traffic tanpa konfigurasi

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────┐
│        Vercel Edge Network (Global CDN)     │
└─────────────────────────────────────────────┘
         ↓ Static            ↓ Serverless
    ┌─────────────┐    ┌──────────────────┐
    │  Frontend   │    │  API Functions   │
    │  (React)    │    │  (Node.js 20.x)  │
    └─────────────┘    └──────────────────┘
         ↓                      ↓
    [index.html]        [/api/health]
    [/js/...]           [/api/chat]
    [/css/...]          [/api/analyze-sickness]
                               ↓
                        ┌──────────────┐
                        │  Groq API    │
                        │  (External)  │
                        └──────────────┘
```

---

## 📋 Requirements

- **Node.js**: 18.0.0 atau lebih tinggi
- **npm**: 9.0.0 atau lebih tinggi
- **Git**: Untuk version control
- **Groq API Key**: Dapatkan gratis dari [Groq Console](https://console.groq.com/keys)
- **Vercel Account**: Untuk deployment (sign up gratis)

---

## 🚀 Quick Start (Development)

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/kos-sickness.git
cd kos-sickness
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
CORS_ORIGIN=auto
VITE_API_URL=http://localhost:3000/api
```

### 3. Development Mode

**Option A: Using Frontend Dev Server Only**
```bash
npm run dev:frontend
# Opens http://localhost:5173
# API calls go to localhost:3000/api
```

**Option B: Using Vercel Dev (Recommended)**
```bash
npm run dev:api
# Opens http://localhost:3000
# Full serverless emulation
```

### 4. Access Application

- Frontend: http://localhost:3000 (or :5173 for dev mode)
- API Health: http://localhost:3000/api/health
- API Docs: http://localhost:3000/api/app-info

---

## 📁 Project Structure

```
kos-sickness/
├── api/                          # Vercel Serverless Functions
│   ├── health.js                # GET /api/health
│   ├── app-info.js              # GET /api/app-info
│   ├── analyze-sickness.js      # POST /api/analyze-sickness
│   ├── chat.js                  # POST /api/chat
│   ├── index.js                 # GET /api (fallback)
│   └── utils/                   # Shared utilities
│       ├── cors.js              # CORS handling
│       ├── validators.js        # Input validation
│       ├── logger.js            # Structured logging
│       ├── groq.js              # Groq configuration
│       └── index.js             # Export barrel
│
├── frontend/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   │       └── apiClient.js     # Axios instance
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── vercel.json                   # Vercel Configuration
├── package.json                  # Root Package
├── .env.example                  # Environment Template
├── .gitignore                    # Git Ignore Rules
│
├── API_REFERENCE.md              # Complete API Docs
├── VERCEL_DEPLOYMENT.md          # Deployment Guide
├── SERVERLESS_ARCHITECTURE.md    # Architecture Details
├── PRODUCTION_CHECKLIST.md       # Deployment Checklist
└── README.md                     # This file
```

---

## 🌐 API Endpoints

### Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Application Info
```bash
GET /api/app-info
```

**Response:** Application metadata, version, available endpoints

### Analyze Sickness
```bash
POST /api/analyze-sickness
Content-Type: application/json

{
  "complaint": "Saya demam dan pusing"
}
```

**Response:** AI-powered health analysis dengan saran pertolongan pertama

### Multi-Turn Chat
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Apa penyebab demam?",
  "conversationId": "conv_123",
  "history": [ /* previous messages */ ]
}
```

**Response:** Contextual AI response dengan conversation history

---

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment

```bash
# Check everything is working
npm run build
npm run test:api

# Commit changes
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### 2. Connect to Vercel

**Option A: Via GitHub (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select GitHub repository
4. Import project

**Option B: Via Vercel CLI**
```bash
vercel link
vercel --prod
```

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```
GROQ_API_KEY=your-api-key
CORS_ORIGIN=auto (or specific domain)
NODE_ENV=production (auto)
```

### 4. Deploy

```bash
# Via Vercel Dashboard: Auto-deploys on git push
# Or via CLI:
vercel --prod
```

### 5. Verify Deployment

```bash
curl https://your-app.vercel.app/api/health
```

---

## 🧪 Testing

### API Testing

```bash
# Run API test suite
npm run test:api              # Linux/Mac
npm run test:api:win          # Windows
```

### Frontend Testing

```bash
# Build frontend
npm run build:frontend

# Preview build
npm run preview
```

### Manual Testing

```bash
# Health check
curl http://localhost:3000/api/health

# App info
curl http://localhost:3000/api/app-info

# Analyze sickness
curl -X POST http://localhost:3000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint":"Saya pusing dan demam 38°C"}'

# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Berapa lama demam normal?"}'
```

---

## 🔒 Security

### Implemented Security Measures

✅ **CORS Validation**
- Whitelist-based origin validation
- Environment-specific configuration

✅ **Input Validation**
- All endpoints validate request data
- Type checking, length constraints
- Early validation (fail fast)

✅ **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

✅ **Environment Variables**
- Secrets in Vercel Settings only
- .env.example has no real keys
- .env files in .gitignore

✅ **Error Handling**
- Sensitive errors not exposed
- Stack traces hidden in production
- User-friendly error messages

✅ **Logging**
- Structured logging with levels
- Sensitive data redacted
- Development vs production aware

---

## 📊 Performance

### Expected Response Times
```
Static Assets:    < 100ms (global CDN)
Health Check:     50-150ms
App Info:         100-200ms
Analyze:          2-5 seconds (Groq API)
Chat:             1-3 seconds (Groq API)
```

### Caching Strategy
```
API Endpoints:    no-cache (always fresh)
Static Assets:    1 year (immutable hash)
HTML:             1 hour (must-revalidate)
```

---

## 🎯 Production Checklist

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for complete deployment checklist including:

- Code quality verification
- Security checks
- Performance optimization
- Testing requirements
- Documentation verification
- Monitoring setup
- Rollback procedures

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation with examples |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Step-by-step deployment guide |
| [SERVERLESS_ARCHITECTURE.md](./SERVERLESS_ARCHITECTURE.md) | Architecture overview and best practices |
| [REFACTOR_GUIDE.md](./REFACTOR_GUIDE.md) | Refactoring details and improvements |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-deployment verification checklist |

---

## 🆘 Troubleshooting

### Issue: "GROQ_API_KEY not found"
→ Set in Vercel Settings or .env.local

### Issue: "CORS error"
→ Check CORS_ORIGIN in environment variables

### Issue: "Function timeout"
→ Increase maxDuration in vercel.json or optimize Groq API calls

### Issue: "Module not found"
→ Run `npm install` and `cd frontend && npm install`

### Issue: "Port already in use"
→ Use different port: `npm run dev:frontend -- --port 5174`

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-endpoint`
3. Make changes and test locally
4. Commit: `git commit -m "feat: add new endpoint"`
5. Push: `git push origin feature/new-endpoint`
6. Create Pull Request

---

## 📈 Future Improvements

- [ ] User authentication & history
- [ ] Database integration for user data
- [ ] Advanced health tracking
- [ ] Integration with real medical APIs
- [ ] Mobile app (React Native)
- [ ] Multilingual support
- [ ] Advanced analytics dashboard

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues and questions:
- Check [API_REFERENCE.md](./API_REFERENCE.md)
- Review [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Create GitHub issue

---

## 🔗 Quick Links

- [Groq Console](https://console.groq.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Project Status:** ✅ Production-Ready  
**Last Updated:** January 2024  
**Version:** 2.0.0 - Vercel Serverless-Only Architecture  
**Maintainer:** Kos-Sickness Team


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
