# Vercel Serverless Architecture

## 📋 Overview

Proyek ini telah direfactor menjadi **Vercel Serverless Functions** architecture. Semua kode Express backend telah dihapus dan digantikan dengan function-based handlers yang compatible dengan Vercel.

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
