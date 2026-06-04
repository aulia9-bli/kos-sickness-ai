# 📁 Database Folder - Index & Documentation

## 📋 Isi Folder Database

```
database/
├── kos_sickness_db.sql          ← DATABASE SCHEMA (MAIN FILE)
├── SETUP_GUIDE.md               ← Panduan setup langkah-langkah
├── README_DATABASE.md            ← Dokumentasi detail database
├── ERD_DIAGRAM.md                ← Entity Relationship Diagram
├── QUERY_EXAMPLES.sql            ← Contoh query siap pakai
├── INDEX.md                      ← File ini
└── backup/                       ← Folder backup (opsional)
    └── [file backup database]
```

---

## 🚀 Quick Start (3 Langkah)

### ✅ Step 1: Buka phpMyAdmin
```
http://localhost/phpmyadmin
```

### ✅ Step 2: Import File `kos_sickness_db.sql`
- Tab "Import"
- Pilih file: `database/kos_sickness_db.sql`
- Klik "Go"

### ✅ Step 3: Verifikasi
- Lihat database `kos_sickness_db` di sidebar
- Lihat 4 tabel: users, consultations, medications, reminders
- Lihat dummy data sudah ada ✅

---

## 📖 Daftar File & Fungsinya

| File | Deskripsi | Kapan Digunakan |
|------|-----------|-----------------|
| **kos_sickness_db.sql** | SQL schema & dummy data | Import ke phpMyAdmin |
| **SETUP_GUIDE.md** | Langkah-langkah setup | First time setup |
| **README_DATABASE.md** | Dokumentasi lengkap | Referensi struktur |
| **ERD_DIAGRAM.md** | Relationship diagram | Memahami relasi tabel |
| **QUERY_EXAMPLES.sql** | Query siap pakai | Copy-paste query |
| **INDEX.md** | File navigasi ini | Orientasi folder |

---

## 🎯 Use Cases

### 📌 Kasus 1: Fresh Install
**Tujuan:** Install database pertama kali

1. Baca: [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Import: `kos_sickness_db.sql`
3. Verify: Query `SELECT * FROM users;`

---

### 📌 Kasus 2: Memahami Struktur Database
**Tujuan:** Tahu tabel & relasi antar tabel

1. Baca: [ERD_DIAGRAM.md](ERD_DIAGRAM.md) - visual diagram
2. Baca: [README_DATABASE.md](README_DATABASE.md) - detail tabel

---

### 📌 Kasus 3: Query Data
**Tujuan:** Ambil data untuk laporan atau testing

1. Buka: [QUERY_EXAMPLES.sql](QUERY_EXAMPLES.sql)
2. Copy query yang diinginkan
3. Paste ke phpMyAdmin → SQL tab
4. Jalankan

---

### 📌 Kasus 4: Troubleshooting
**Tujuan:** Database error

1. Baca: [SETUP_GUIDE.md](SETUP_GUIDE.md) → Troubleshooting section
2. Cek error message di phpMyAdmin
3. Coba solusi yang disarankan

---

## 🏗️ Database Architecture

```
Kos-Sickness Database (kos_sickness_db)
│
├─ USERS (Pengguna/Mahasiswa)
│  ├─ id, nama_lengkap, email, universitas
│  ├─ alamat_kos, kecamatan_semarang, no_hp_darurat
│  └─ Data: 3 dummy users (Shabrina, Uswatun, Ahmad)
│
├─ CONSULTATIONS (Riwayat Konsultasi)
│  ├─ id, user_id (FK), keluhan, gejala_tambahan
│  ├─ saran_awal (dari AI), status_darurat, tanggal_konsultasi
│  └─ Data: 3 consultations (2 Shabrina, 1 Uswatun)
│
├─ MEDICATIONS (Data Obat-Obatan)
│  ├─ id, user_id (FK), nama_obat, dosis
│  ├─ stok_awal, stok_saat_ini, created_at, updated_at
│  └─ Data: 5 medications (3 Shabrina, 2 Uswatun)
│
└─ REMINDERS (Pengingat Minum Obat)
   ├─ id, medication_id (FK), waktu_pengingat
   ├─ status_diminum, tanggal_diminum, keterangan
   └─ Data: 7 reminders (5 Shabrina, 2 Uswatun)

VIEWS (Query Hasil):
├─ v_latest_consultations - konsultasi terbaru per user
└─ v_today_reminders - pengingat hari ini
```

---

## 📊 Data Summary

| Tabel | Jumlah Baris | Status |
|-------|-------------|--------|
| users | 3 | ✅ Ready |
| consultations | 3 | ✅ Ready |
| medications | 5 | ✅ Ready |
| reminders | 7 | ✅ Ready |
| **Total** | **18** | ✅ |

---

## 👥 Dummy Data Users

### User 1: Shabrina Aulia
- Email: `shabrina.aulia@email.com`
- Universitas: Universitas Stikubank Semarang
- Alamat Kos: Kos Putri Indah, Jl. Letnan Jendral Katamso No. 20
- Kecamatan: Candisari
- Konsultasi: 2 (Sakit kepala, Batuk)
- Obat: 3 (Paracetamol, Obat Batuk, Ibuprofen)
- Pengingat: 5

### User 2: Uswatun Aulia
- Email: `uswatun.aulia@email.com`
- Universitas: Universitas Stikubank Semarang
- Alamat Kos: Kos Ceria, Jl. Pandanaran No. 45
- Kecamatan: Gajahmungkur
- Konsultasi: 1 (Perut kembung)
- Obat: 2 (Obat Perut, Minyak Kayu Putih)
- Pengingat: 2

### User 3: Ahmad Rizki (Test User)
- Email: `ahmad.rizki@email.com`
- Universitas: Universitas Stikubank Semarang
- Alamat Kos: Kos Eksis, Jl. Kaligawe No. 12
- Kecamatan: Semarang Timur
- Konsultasi: 0 (Belum ada)
- Obat: 0 (Belum ada)
- Pengingat: 0 (Belum ada)

---

## 🔍 Quick Queries

### Lihat Semua Users
```sql
SELECT * FROM users;
```

### Lihat Konsultasi Shabrina
```sql
SELECT * FROM consultations WHERE user_id = 1;
```

### Lihat Obat & Pengingat
```sql
SELECT m.*, r.* 
FROM medications m 
LEFT JOIN reminders r ON m.id = r.medication_id 
WHERE m.user_id = 1;
```

### Hitung Konsultasi per User
```sql
SELECT u.nama_lengkap, COUNT(c.id) as total 
FROM users u 
LEFT JOIN consultations c ON u.id = c.user_id 
GROUP BY u.id;
```

---

## ⚙️ Configuration

### File Backend Config
- Location: `backend/.env`
- Database section sudah included:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=kos_sickness_db
  DB_PORT=3306
  ```

### Backend Connection
- Package: `mysql2` atau `mysql2/promise`
- Connection Pool: 10 concurrent connections
- Charset: UTF-8 MB4
- Timezone: +07:00 (Indonesia)

---

## 📱 Backend Integration

### File: `backend/src/config/database.js`
Sudah ada file config untuk koneksi MySQL

```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kos_sickness_db',
  // ... konfigurasi lain
});
```

### Cara Menggunakan di Backend
```javascript
const pool = require('./config/database');

// Get connection
const connection = await pool.getConnection();

// Execute query
const [rows] = await connection.execute('SELECT * FROM users');

// Release
connection.release();
```

---

## 🔐 Security Notes

✅ **Best Practices Diterapkan:**
- Password tidak di-hardcode (use .env)
- Character set UTF-8 MB4 untuk unicode support
- Foreign key constraints untuk data integrity
- Index untuk performa query
- Views untuk enkapsulasi query kompleks

⚠️ **Untuk Production:**
- Ubah default password MySQL
- Setup proper user permissions
- Enable database backups
- Monitor query performance
- Use SSL/TLS untuk koneksi
- Implement query rate limiting

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Database not found | Baca: [SETUP_GUIDE.md](SETUP_GUIDE.md) → Step 3 |
| Connection denied | Pastikan MySQL running, baca: [SETUP_GUIDE.md](SETUP_GUIDE.md) → Troubleshooting |
| Foreign key error | Baca: [README_DATABASE.md](README_DATABASE.md) → Constraints |
| Charset issues | Baca: [SETUP_GUIDE.md](SETUP_GUIDE.md) → Error UTF-8 |
| Query syntax error | Copy dari: [QUERY_EXAMPLES.sql](QUERY_EXAMPLES.sql) |

---

## 📚 Learning Resources

### Untuk Memahami Database
1. Baca: [README_DATABASE.md](README_DATABASE.md) - Penjelasan detail
2. Lihat: [ERD_DIAGRAM.md](ERD_DIAGRAM.md) - Visual relationship
3. Praktik: [QUERY_EXAMPLES.sql](QUERY_EXAMPLES.sql) - Coba query

### Untuk Setup
1. Ikuti: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Step by step

### Untuk Deploy
1. Backup database
2. Export schema
3. Import ke production server

---

## 🎯 Next Steps

- [ ] Import database ke phpMyAdmin
- [ ] Verifikasi semua tabel & data ada
- [ ] Test koneksi dari backend Node.js
- [ ] Buat API endpoints untuk database
- [ ] Setup real-time sync dengan frontend

---

## 📞 Reference

| Item | Detail |
|------|--------|
| Database Name | `kos_sickness_db` |
| Tables | 4 (users, consultations, medications, reminders) |
| Views | 2 (v_latest_consultations, v_today_reminders) |
| Dummy Users | 3 (Shabrina, Uswatun, Ahmad) |
| Total Records | 18 rows |
| Charset | UTF-8 MB4 |
| Total Size | ~50 KB |

---

## 📝 Version Info

- **Database Version**: 1.0.0
- **Created**: 2024
- **Last Updated**: March 2024
- **For Project**: Kos-Sickness UTS AI
- **By**: Shabrina Aulia & Uswatun Aulia
- **Institution**: Universitas Stikubank Semarang

---

## 📖 Navigation

- 🔙 Back to main: `../README.md`
- Backend config: `../backend/.env`
- Frontend config: `../frontend/.env`

---

**Happy Database Management! 🎉**
