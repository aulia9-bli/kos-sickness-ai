# 📋 INSTALASI & SETUP LENGKAP

## 🎯 Requirement Sistem

- **Node.js**: v16 atau lebih tinggi
- **npm**: v7 atau lebih tinggi (biasanya sudah otomatis dengan Node.js)
- **Git**: Untuk version control (optional)
- **Groq API Key**: Dapatkan di https://console.groq.com

---

## 🚀 Step-by-Step Installation

### Step 1: Download/Clone Project

```bash
# Jika menggunakan git
git clone https://github.com/your-username/kos-sickness.git
cd kos-sickness

# Atau jika sudah di-download
cd Kos_Sickness2
```

### Step 2: Dapatkan Groq API Key

1. Buka https://console.groq.com
2. Login dengan akun Anda (atau buat akun baru)
3. Klik **"API Keys"** di sidebar
4. Klik **"Create New API Key"**
5. Copy API key yang sudah dibuat
6. **Jangan share API key ini ke orang lain!**

### Step 3: Setup Backend

**A. Install Dependencies**
```bash
cd backend
npm install
```

**B. Configure Environment Variables**
```bash
# Buka file .env dengan editor teks
# Windows (Command Prompt/PowerShell)
notepad .env

# macOS/Linux
nano .env
```

**C. Isi .env dengan:**
```
GROQ_API_KEY=<paste_api_key_anda_di_sini>
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**D. Test Backend**
```bash
npm run dev
```

Anda akan melihat output seperti:
```
╔══════════════════════════════════════════════════╗
║   🏥 KOS-SICKNESS API SERVER                    ║
║   Status: ✅ RUNNING                            ║
║   Port: 5000                                     ║
╚══════════════════════════════════════════════════╝

📍 Base URL: http://localhost:5000
```

Jika backend sudah running, biarkan terminal ini tetap terbuka.

### Step 4: Setup Frontend (Terminal Baru)

**A. Masuk ke folder frontend**
```bash
cd frontend
```

**B. Install Dependencies**
```bash
npm install
```

**C. Jalankan Development Server**
```bash
npm run dev
```

Anda akan melihat:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### Step 5: Test Aplikasi

1. Buka browser ke http://localhost:3000
2. Lihat tampilan Kos-Sickness
3. Input keluhan kesehatan Anda
4. Klik tombol "Dapatkan Saran Kesehatan"
5. Tunggu AI memberikan respon

---

## 🧪 Testing API dengan Postman atau cURL

### Menggunakan Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import collection: `Kos-Sickness-API.postman_collection.json`
3. Ubah `api_url` variable menjadi `http://localhost:5000`
4. Jalankan requests

### Menggunakan cURL (Command Line)

**Test 1: Health Check**
```bash
curl -X GET http://localhost:5000/api/health
```

**Test 2: Analyze Sickness**
```bash
curl -X POST http://localhost:5000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya mengalami sakit kepala dan demam"}'
```

**Untuk Windows (PowerShell):**
```powershell
$body = @{"complaint"="Saya mengalami sakit kepala"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/analyze-sickness" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'groq-sdk'"

**Solusi:**
```bash
cd backend
npm install groq-sdk
```

### ❌ Error: "GROQ_API_KEY is not defined"

**Solusi:**
- Pastikan `.env` file sudah ada di folder `backend`
- Pastikan `GROQ_API_KEY` sudah diisi dengan benar
- Cek tidak ada spasi atau karakter tambahan

### ❌ Error: "Port 5000 already in use"

**Solusi 1: Ubah PORT**
```bash
# Edit backend/.env
PORT=5001
```

**Solusi 2: Kill process yang menggunakan port 5000**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID_NUMBER>
```

### ❌ Error: "Port 3000 already in use"

**Solusi: Edit frontend/vite.config.js**
```javascript
server: {
  port: 3001,  // Ubah ke port lain
  open: true,
}
```

### ❌ CORS Error di Browser

**Solusi:**
- Pastikan backend running di port 5000
- Pastikan `CORS_ORIGIN` di `.env` backend sesuai frontend URL
- Coba hard refresh browser (Ctrl+Shift+R atau Cmd+Shift+R)

### ❌ API Response "Network Error"

**Solusi:**
1. Pastikan backend sudah running (`npm run dev` di backend folder)
2. Pastikan tidak ada error di terminal backend
3. Test API langsung dengan cURL atau Postman
4. Check firewall atau antivirus yang mungkin blocking

### ❌ "GROQ_API_KEY invalid or expired"

**Solusi:**
1. Cek API key di console.groq.com
2. Pastikan API key masih valid
3. Generate API key baru jika perlu
4. Update `.env` dengan API key yang baru

---

## 📦 Dependencies Installation

Jika ada error saat npm install, coba:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Atau install dengan legacy peer deps
npm install --legacy-peer-deps
```

---

## 🔄 Development Workflow

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Akan auto-restart ketika ada perubahan file (.js)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Akan hot-reload ketika ada perubahan file (.jsx)
```

---

## ✅ Checklist Sebelum Deploy

- [ ] API key sudah aktif di Groq Console
- [ ] Backend `.env` sudah configured
- [ ] Frontend `.env` sudah configured
- [ ] Test API endpoint dengan Postman/cURL
- [ ] Frontend bisa connect ke backend
- [ ] Tidak ada console error
- [ ] Build frontend: `npm run build` di folder frontend
- [ ] Build berhasil dan tidak ada error

---

## 🚀 Next Steps

1. ✅ Selesaikan setup sesuai panduan di atas
2. ✅ Test aplikasi
3. ✅ Customize tampilan atau fitur (optional)
4. ✅ Deploy ke Vercel atau Render
5. ✅ Share ke teman/dosen

---

## 📞 Support & Help

Jika masih ada error atau pertanyaan:

1. **Check dokumentasi:**
   - README.md
   - QUICK_START.md
   - backend/README.md
   - frontend/README.md

2. **Google error message Anda**

3. **Check Stack Overflow atau GitHub Issues**

4. **Ask ChatGPT atau Claude dengan error message lengkap**

---

**Happy Coding! 🎉 Jangan lupa istirahat cukup! 😴**
