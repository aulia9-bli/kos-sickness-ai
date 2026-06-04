# 🚀 QUICK START GUIDE - Kos-Sickness Project

## ⚡ Setup Pertama Kali

### 1️⃣ Persiapan Environment

**A. Dapatkan Groq API Key:**
- Kunjungi https://console.groq.com
- Login atau buat akun
- Generate API key baru
- Copy API key tersebut

**B. Setup Backend:**
```bash
cd backend
npm install
```

Buka file `.env` dan isi:
```
GROQ_API_KEY=<paste API key Anda di sini>
```

**C. Setup Frontend:**
```bash
cd frontend
npm install
```

### 2️⃣ Jalankan Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Server berjalan di: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ App berjalan di: http://localhost:3000

### 3️⃣ Test API

Buka Postman atau gunakan curl:
```bash
curl -X POST http://localhost:5000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya mengalami sakit kepala"}'
```

---

## 📁 Struktur File Penting

```
Kos_Sickness2/
├── backend/
│   ├── src/server.js ........................ Entry point backend
│   ├── src/routes/health.js ................. API routes
│   ├── src/controllers/sicknessController.js  Business logic
│   ├── src/config/groq.js ................... Groq setup
│   ├── .env ................................ API key Anda (JANGAN PUSH!)
│   └── package.json
│
├── frontend/
│   ├── src/App.jsx ......................... Main component
│   ├── src/components/ ..................... UI Components
│   ├── src/services/apiClient.js ........... API integration
│   ├── .env ................................ Frontend config
│   └── package.json
│
├── README.md ............................... Main documentation
├── vercel.json ............................. Vercel config
└── render.yaml ............................. Render config
```

---

## 🔧 Common Commands

| Command | Lokasi | Fungsi |
|---------|--------|--------|
| `npm run dev` | backend/ | Run backend development |
| `npm start` | backend/ | Run backend production |
| `npm run dev` | frontend/ | Run frontend development |
| `npm run build` | frontend/ | Build frontend |
| `npm run preview` | frontend/ | Preview production build |

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'groq-sdk'"
```bash
cd backend
npm install groq-sdk
```

### ❌ "GROQ_API_KEY is invalid"
- Cek file `.env` di backend folder
- Pastikan API key sudah benar dari console.groq.com
- Jangan ada space atau karakter tambahan

### ❌ "CORS Error"
- Pastikan backend `CORS_ORIGIN` di .env sesuai frontend URL
- Default: `http://localhost:3000`

### ❌ "Port 5000 sudah digunakan"
```bash
# Ubah di backend/.env
PORT=5001
```

### ❌ "Port 3000 sudah digunakan"
```bash
# Edit vite.config.js di frontend
server: {
  port: 3001,
}
```

---

## 📦 Dependencies Penting

### Backend
- `express` - Web framework
- `groq-sdk` - Groq AI integration
- `cors` - CORS support
- `dotenv` - Environment variables
- `nodemon` - Auto-restart (dev only)

### Frontend
- `react` - UI library
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `axios` - HTTP client

---

## 🚀 Deployment Checklist

- [ ] API key sudah aktif di Groq Console
- [ ] Backend .env sudah di-configure
- [ ] Frontend .env sudah di-configure
- [ ] Test API endpoint berjalan dengan baik
- [ ] Frontend bisa connect ke backend
- [ ] Tidak ada console error
- [ ] Build production berhasil (`npm run build` di frontend)

---

## 📝 API Endpoint Reference

### Health Check
```
GET /api/health
```

### Analyze Sickness
```
POST /api/analyze-sickness
Body: { "complaint": "..." }
```

---

## 🎯 Next Steps

1. ✅ Setup sesuai panduan di atas
2. ✅ Test API dengan Postman
3. ✅ Customise prompt di `sicknessController.js`
4. ✅ Add lebih banyak features
5. ✅ Deploy ke Vercel/Render

---

## 📚 Dokumentasi Lengkap

- Backend: `./backend/README.md`
- Frontend: `./frontend/README.md`
- Main: `./README.md`

---

**Happy Coding! 🎉**

Jika ada pertanyaan, cek dokumentasi atau buat issue di GitHub.
