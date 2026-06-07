# Vercel Serverless-Only Architecture - Production Ready

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│          Vercel Edge Network (Global CDN)               │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
    ┌────────────────┐          ┌────────────────┐
    │ Static Assets  │          │  Functions     │
    │ (Frontend)     │          │  (API)         │
    ├────────────────┤          ├────────────────┤
    │ React + Vite   │          │ Serverless     │
    │ Built Files    │          │ Node.js 20.x   │
    │ Cache: 1 year  │          │ Cache: no-cache│
    └────────────────┘          └────────────────┘
            ↓                            ↓
    ┌─────────────────┐        ┌──────────────────┐
    │ index.html      │        │ /api/health      │
    │ /js/...         │        │ /api/app-info    │
    │ /css/...        │        │ /api/analyze-    │
    │ /assets/...     │        │ sickness         │
    └─────────────────┘        │ /api/chat        │
                               └──────────────────┘
                                      ↓
                              ┌──────────────────┐
                              │ Groq API         │
                              │ (External SaaS)  │
                              └──────────────────┘
```

---

## 📁 Project Structure (Serverless-Only)

```
kos-sickness/
├── api/                        # ⭐ Vercel Serverless Functions
│   ├── health.js              # GET /api/health
│   ├── app-info.js            # GET /api/app-info
│   ├── analyze-sickness.js    # POST /api/analyze-sickness
│   ├── chat.js                # POST /api/chat
│   ├── index.js               # GET /api (fallback)
│   └── utils/                 # Shared utilities
│       ├── cors.js            # CORS handling
│       ├── validators.js      # Input validation
│       ├── logger.js          # Structured logging
│       ├── groq.js            # Groq configuration
│       └── index.js           # Export all
│
├── frontend/                   # ⭐ React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   │       └── apiClient.js   # API client for serverless
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── vercel.json                 # ⭐ Vercel Configuration
├── package.json                # Root package.json
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
│
├── API_REFERENCE.md            # Complete API docs
├── VERCEL_DEPLOYMENT.md        # Deployment guide
├── REFACTOR_GUIDE.md           # Refactor details
└── README.md                   # Project info

REMOVED (Legacy):
├── ❌ backend/                 # No longer needed (serverless)
├── ❌ database/                # Not needed (stateless)
└── ❌ render.yaml              # Not needed (using Vercel)
```

---

## ⚙️ Configuration Breakdown

### vercel.json - Complete Configuration

```json
{
  "version": 2,
  "name": "kos-sickness",
  "buildCommand": "npm run build:frontend",
  "installCommand": "npm install && cd frontend && npm install",
  "builds": [
    {
      "src": "frontend/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": "package.json",
        "maxDuration": 60,
        "memory": 1024
      }
    }
  ],
  "routes": [
    // Specific API endpoints (must come first)
    { "src": "/api/health", "dest": "/api/health.js", "methods": ["GET", "OPTIONS"] },
    { "src": "/api/app-info", "dest": "/api/app-info.js", "methods": ["GET", "OPTIONS"] },
    { "src": "/api/analyze-sickness", "dest": "/api/analyze-sickness.js", "methods": ["POST", "OPTIONS"] },
    { "src": "/api/chat", "dest": "/api/chat.js", "methods": ["POST", "OPTIONS"] },
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    
    // Static assets (cached 1 year)
    { "src": "/(.*\\.(?:js|css|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|map))", "dest": "/frontend/dist/$1" },
    
    // SPA fallback (index.html)
    { "src": "/(.*)", "dest": "/frontend/dist/index.html" }
  ],
  "env": {
    "NODE_ENV": "production",
    "CORS_ORIGIN": "@CORS_ORIGIN"
  },
  "envs": {
    "preview": { "CORS_ORIGIN": "auto" },
    "production": { "CORS_ORIGIN": "https://kos-sickness.vercel.app" }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/frontend/dist/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "regions": ["sfo1"],
  "public": false,
  "trailingSlash": false
}
```

---

## 🚀 How It Works

### Static Frontend Deployment
1. **Build**: `npm run build:frontend` creates `frontend/dist/`
2. **Hosting**: Vercel serves files from Edge Network
3. **Caching**: Hashed filenames cached for 1 year
4. **HTML**: Cached for 1 hour (must-revalidate)

### Serverless API Functions
1. **File Structure**: `api/*.js` = separate functions
2. **Routing**: `vercel.json` maps URLs to files
3. **Execution**: Node.js 20.x runtime, on-demand
4. **Scaling**: Automatic based on traffic

### Example: POST Request to /api/chat
```
Browser Request
  ↓
Vercel Edge → Check route (matches /api/chat)
  ↓
Invoke api/chat.js function
  ↓
Function executes:
  - Parse request body
  - Validate input
  - Initialize Groq client
  - Call Groq API
  - Return response
  ↓
Vercel adds CORS headers
  ↓
Response sent to browser
```

---

## 🔐 Security Architecture

### Network Layer
- ✅ HTTPS enforced (Vercel automatic)
- ✅ DDoS protection (Vercel automatic)
- ✅ WAF protection (Vercel included)

### API Layer
- ✅ CORS whitelist (configurable)
- ✅ Method validation (GET, POST, OPTIONS)
- ✅ Headers security (X-Frame-Options, X-Content-Type-Options, etc)
- ✅ Input validation (all endpoints)

### Application Layer
- ✅ Environment variable secrets (Vercel Settings)
- ✅ Error handling (no sensitive data exposed)
- ✅ Logging (redacted sensitive data)
- ✅ Rate limiting (Groq API level)

---

## 📊 Performance Metrics

### Expected Response Times
```
Static Assets:         < 100ms (cached, global CDN)
Health Check:          50-150ms
App Info:              100-200ms
Analyze Sickness:      2-5 seconds (Groq API call)
Chat:                  1-3 seconds (Groq API call)
```

### Function Limits
```
Max Execution Time:    60 seconds
Max Memory:            1024 MB
Max Payload:           6 MB
Concurrent:            Auto-scaling
Cold Start:            300-500ms (Node.js 20)
Warm Start:            50-100ms
```

### Caching Strategy
```
API Endpoints:         no-cache (always fresh)
Static Assets:         1 year (immutable hash)
HTML:                  1 hour (must-revalidate)
```

---

## 🧪 Local Development

### Setup
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your GROQ_API_KEY
```

### Development Servers
```bash
# Terminal 1: Frontend (Vite dev server)
npm run dev:frontend

# Terminal 2: API Functions (Vercel dev)
npm run dev:api

# Then visit: http://localhost:3000
```

### Testing
```bash
# Test API endpoints
npm run test:api              # Linux/Mac
npm run test:api:win          # Windows

# Test frontend build
npm run build && npm run preview
```

---

## 🔄 Deployment Workflow

### Automatic Deployment (Recommended)
```
1. Push to GitHub (any branch)
2. Vercel auto-detects changes
3. Branch deployment (preview or production)
4. Auto-generated URL for testing
5. Merge PR → auto-deploy to production
```

### Manual Deployment
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# View logs
vercel logs <deployment-id>
```

---

## 🌍 Environment Configuration

### For Preview/Staging
```
GROQ_API_KEY=your-key (from Vercel Settings)
CORS_ORIGIN=auto (allow any origin)
NODE_ENV=production (auto)
```

### For Production
```
GROQ_API_KEY=your-key (from Vercel Settings)
CORS_ORIGIN=https://kos-sickness.vercel.app
NODE_ENV=production (auto)
```

---

## 💡 Key Differences from Express

### Express Backend (Old)
```javascript
// Separate server process
const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(5000);
```

### Vercel Functions (New)
```javascript
// Simple handler function
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}

// File location: api/health.js
// Automatically routed by Vercel
```

### Benefits
- ✅ No server to manage
- ✅ Auto-scaling
- ✅ Pay per invocation (cheaper)
- ✅ Better performance (CDN)
- ✅ Simpler deployment

---

## 🎯 Production Checklist

- [x] Vercel configuration optimized
- [x] Environment variables secured
- [x] CORS headers configured
- [x] Security headers added
- [x] Error handling centralized
- [x] Logging structured
- [x] Input validation comprehensive
- [x] Frontend optimized with Vite
- [x] Build process automated
- [ ] Error tracking integrated (optional: Sentry)
- [ ] Performance monitoring active
- [ ] Load testing completed
- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] Backup plan documented

---

## 📚 Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Node.js Serverless Best Practices](https://nodejs.org/en/docs/guides/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Vite Build Tool](https://vitejs.dev/)

---

## 🆘 Troubleshooting

### Issue: "Cannot find module"
→ Check `package.json` dependencies and reinstall

### Issue: "CORS error"
→ Verify `CORS_ORIGIN` in Vercel Settings

### Issue: "API timeout"
→ Check Groq API status, increase `maxDuration`

### Issue: "Function size too large"
→ Remove unused dependencies, use tree-shaking

---

**Architecture:** Vercel Serverless-Only  
**Version:** 2.0.0  
**Status:** Production-Ready ✅  
**Last Updated:** January 2024


## 🏗️ Struktur Folder

```
├── api/                          # Vercel Serverless Functions
│   ├── index.js                 # GET / - Root endpoint
│   ├── health.js                # GET /api/health - Health check
│   ├── app-info.js              # GET /api/app-info - Application info
│   ├── analyze-sickness.js      # POST /api/analyze-sickness - Sickness analysis
│   └── chat.js                  # POST /api/chat - Chat interface
├── frontend/                     # React frontend (Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── apiClient.js     # API client untuk serverless functions
│   │   └── ...
│   └── ...
├── vercel.json                   # Konfigurasi Vercel
├── package.json                  # Root package.json
└── .env.example                 # Environment variables template
```

## 🚀 Endpoints

Semua endpoints diakses melalui `/api/` prefix:

### 1. GET /api/index
Root endpoint untuk informasi aplikasi
```bash
curl http://localhost:3000/api
```

### 2. GET /api/health
Health check endpoint
```bash
curl http://localhost:3000/api/health
```

### 3. GET /api/app-info
Informasi lengkap aplikasi dan endpoint
```bash
curl http://localhost:3000/api/app-info
```

### 4. POST /api/analyze-sickness
Analisis kesehatan menggunakan Groq AI
```bash
curl -X POST http://localhost:3000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint":"Sakit kepala"}'
```

### 5. POST /api/chat
Chat interface untuk konsultasi kesehatan
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"complaint":"Demam tinggi"}'
```

## 🔧 Konfigurasi Vercel

File `vercel.json` telah diperbarui untuk:

1. **Builds**: Menggunakan `/api/` directory untuk Vercel Functions
2. **Routes**: 
   - `/api/*` → `/api/*.js` (Serverless Functions)
   - `/*` → `frontend/dist/index.html` (Static Frontend)
3. **Environment Variables**: 
   - `NODE_ENV=production`
   - `CORS_ORIGIN=auto`

## 🔐 Environment Variables

Buat file `.env.local` di root project:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
```

Atau gunakan `.env.example` sebagai template:
```bash
cp .env.example .env.local
```

## 💡 Fitur Serverless Functions

### 1. CORS Handling
Setiap function secara otomatis menangani CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
```

### 2. Method Validation
Setiap endpoint hanya menerima method yang sesuai dan merespons dengan error 405 untuk method yang tidak diizinkan.

### 3. Error Handling
- **400 Bad Request**: Validasi input gagal
- **401 Unauthorized**: API Key tidak valid
- **408 Request Timeout**: Groq API timeout
- **429 Too Many Requests**: Rate limiting
- **500 Internal Server Error**: Error umum

### 4. Input Validation
Validasi minimal untuk complaint:
- Wajib ada field `complaint`
- Tipe harus string
- Minimal 5 karakter
- Maksimal 2000 karakter

## 🛠️ Development

### 1. Instalasi Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Test API Endpoints
Gunakan test files yang sudah disediakan:

**Windows:**
```bash
npm run test:api:win
```

**Linux/Mac:**
```bash
npm run test:api
```

### 3. Local Testing dengan Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev
```

## 🌍 Deployment ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Refactor: Vercel Serverless Architecture"
git push origin main
```

### 2. Connect ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "New Project"
3. Pilih repository GitHub Anda
4. Konfigurasi environment variables:
   - `GROQ_API_KEY`: API key dari Groq
   - `CORS_ORIGIN`: Frontend URL

### 3. Deploy
Vercel akan otomatis deploy saat commit ke main branch

## 📊 Perbandingan: Express vs Serverless

| Aspek | Express (Lama) | Serverless (Baru) |
|-------|---|---|
| Architecture | Traditional Server | Vercel Functions |
| Port | 5000 | Auto (Vercel) |
| Scaling | Manual | Auto (Vercel) |
| Cold Start | N/A | ~100-500ms |
| Cost | Per server | Per execution |
| CORS | Middleware | Per function |
| Environment | Node.js | Node.js 18+ |

## ✅ Keuntungan Serverless

1. **Scalability**: Auto-scale tanpa configuration
2. **Cost-Efficient**: Bayar per usage, bukan per server
3. **Fast Deployment**: Deploy dengan satu command
4. **No Maintenance**: Vercel handle infrastructure
5. **Global CDN**: Automatic edge caching
6. **Simple Architecture**: Function-based, mudah dipahami

## ⚠️ Breaking Changes

### Dihapus:
- ❌ `backend/src/server.js` - Express server
- ❌ `express` dan `cors` middleware
- ❌ `app.listen()` dan port configuration
- ❌ Express routing system
- ❌ Node.js traditional server

### Tetap Preserved:
- ✅ Groq SDK integration
- ✅ Input validation logic
- ✅ Error handling
- ✅ System prompt untuk AI
- ✅ Frontend (Vite + React)

## 🐛 Troubleshooting

### 1. API 404 Error
```
Problem: GET /api/health returns 404
Solution: Pastikan vercel.json memiliki routing yang benar
```

### 2. CORS Error
```
Problem: CORS error di browser
Solution: Pastikan CORS_ORIGIN di .env.local sesuai frontend URL
```

### 3. Groq API Key Error
```
Problem: "GROQ_API_KEY tidak ditemukan"
Solution: Set GROQ_API_KEY di .env.local atau Vercel environment
```

### 4. Cold Start Timeout
```
Problem: Request timeout saat pertama kali
Solution: Normal untuk cold start, tunggu ~30 detik untuk warm up
```

## 📚 Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Groq SDK](https://console.groq.com)
- [Vite Documentation](https://vitejs.dev)
- [Node.js 18+ Runtime](https://vercel.com/docs/functions/runtimes/node-js)

## 🔄 Migration Checklist

- [x] Hapus Express backend
- [x] Buat Vercel Functions
- [x] Update vercel.json routing
- [x] Update package.json
- [x] CORS headers di setiap function
- [x] Error handling
- [x] Environment variables
- [x] Documentation

## 📝 Notes

Serverless architecture ini ideal untuk:
- ✅ Small to medium applications
- ✅ Low to medium traffic
- ✅ Periodic API usage
- ✅ Cost-conscious projects
- ✅ Rapid prototyping

Pertimbangkan alternatif jika:
- ❌ High frequency API calls (>100k/month)
- ❌ Long-running processes (>30s execution time)
- ❌ Real-time WebSocket connections
- ❌ Persistent background jobs
