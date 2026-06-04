# 📊 Panduan Penggunaan Database Kos-Sickness

## 📋 Daftar Isi
1. [Struktur Database](#struktur-database)
2. [Cara Import ke phpMyAdmin](#cara-import-ke-phpmyadmin)
3. [Struktur Tabel](#struktur-tabel)
4. [Contoh Query](#contoh-query)
5. [Tips Penggunaan](#tips-penggunaan)

---

## 🏗️ Struktur Database

Database **`kos_sickness_db`** terdiri dari 4 tabel utama:

```
┌─────────────────────────────────────────┐
│              USERS                      │
│ (Pengguna/Mahasiswa)                   │
├─────────────────────────────────────────┤
│ • id (PK)                              │
│ • nama_lengkap                         │
│ • email (UNIQUE)                       │
│ • universitas                          │
│ • alamat_kos                           │
│ • kecamatan_semarang                   │
│ • no_hp_darurat                        │
│ • created_at                           │
└─────────────────────────────────────────┘
            ↓ (1:N)
┌─────────────────────────────────────────┐
│         CONSULTATIONS                   │
│    (Riwayat Konsultasi)                │
├─────────────────────────────────────────┤
│ • id (PK)                              │
│ • user_id (FK)                         │
│ • keluhan                              │
│ • gejala_tambahan                      │
│ • saran_awal (dari AI)                │
│ • status_darurat (enum)                │
│ • tanggal_konsultasi                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         MEDICATIONS                     │
│      (Data Obat-Obatan)               │
├─────────────────────────────────────────┤
│ • id (PK)                              │
│ • user_id (FK)                         │
│ • nama_obat                            │
│ • dosis                                │
│ • stok_awal                            │
│ • stok_saat_ini                        │
│ • created_at                           │
│ • updated_at                           │
└─────────────────────────────────────────┘
            ↓ (1:N)
┌─────────────────────────────────────────┐
│         REMINDERS                       │
│  (Pengingat Minum Obat)               │
├─────────────────────────────────────────┤
│ • id (PK)                              │
│ • medication_id (FK)                   │
│ • waktu_pengingat                      │
│ • status_diminum (enum)                │
│ • tanggal_diminum                      │
│ • keterangan                           │
│ • created_at                           │
└─────────────────────────────────────────┘
```

---

## 🚀 Cara Import ke phpMyAdmin

### Metode 1: Import File SQL Langsung (RECOMMENDED)

1. **Buka phpMyAdmin**
   - Akses: `http://localhost/phpmyadmin`
   - Login dengan username: `root` (default, tanpa password)

2. **Klik menu "Import"**
   - Pilih tab "Import" di header phpMyAdmin

3. **Upload File SQL**
   - Klik "Choose File" atau "Pilih File"
   - Navigasi ke: `c:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql`
   - Pilih file tersebut

4. **Konfigurasi Import (Optional)**
   - Character Set: **utf8mb4** (sudah default)
   - Klik tombol **"Go"** atau **"Impor"**

5. **Verifikasi**
   - Sebelah kiri, database `kos_sickness_db` akan muncul
   - Klik untuk melihat 4 tabel: users, consultations, medications, reminders

### Metode 2: Copy-Paste SQL (Alternatif)

1. **Buka File SQL**
   - Buka `kos_sickness_db.sql` dengan text editor

2. **Copy Seluruh Isi**
   - Ctrl+A untuk select all
   - Ctrl+C untuk copy

3. **Masuk phpMyAdmin**
   - Klik tab "SQL"
   - Paste kode SQL
   - Klik **"Go"** atau **"Jalankan"**

### Metode 3: Command Line MySQL (Advanced)

```bash
# Buka terminal/PowerShell
cd c:\xampp\mysql\bin

# Jalankan command
mysql -u root < "c:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql"

# Atau dengan import ke database
mysql -u root kos_sickness_db < "c:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql"
```

---

## 📊 Struktur Tabel Detail

### 1️⃣ Tabel USERS

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  universitas VARCHAR(255) NOT NULL,
  alamat_kos TEXT NOT NULL,
  kecamatan_semarang VARCHAR(100),
  no_hp_darurat VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Contoh Data:**
```
ID | nama_lengkap    | email                    | universitas | alamat_kos              | kecamatan_semarang | no_hp_darurat
1  | Shabrina Aulia  | shabrina.aulia@email.com | Unistikum   | Kos Putri Indah         | Candisari          | 08123456789
2  | Uswatun Aulia   | uswatun.aulia@email.com  | Unistikum   | Kos Ceria               | Gajahmungkur       | 08987654321
```

### 2️⃣ Tabel CONSULTATIONS

```sql
CREATE TABLE consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  keluhan TEXT NOT NULL,
  gejala_tambahan TEXT,
  saran_awal LONGTEXT NOT NULL,
  status_darurat ENUM('normal', 'warning', 'urgent') DEFAULT 'normal',
  tanggal_konsultasi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Status Darurat:**
- `normal`: Gejala ringan, bisa dirawat di rumah
- `warning`: Gejala sedang, perlu perhatian medis
- `urgent`: Gejala berat, harus ke rumah sakit

### 3️⃣ Tabel MEDICATIONS

```sql
CREATE TABLE medications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nama_obat VARCHAR(255) NOT NULL,
  dosis VARCHAR(100) NOT NULL,
  stok_awal INT NOT NULL,
  stok_saat_ini INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Contoh Dosis:**
- `500mg 2x sehari`
- `1 sendok makan 3x sehari`
- `1 tablet 1x sebelum tidur`

### 4️⃣ Tabel REMINDERS

```sql
CREATE TABLE reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medication_id INT NOT NULL,
  waktu_pengingat TIME NOT NULL,
  status_diminum ENUM('belum', 'sudah', 'terlewat') DEFAULT 'belum',
  tanggal_diminum DATE,
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);
```

**Status Diminum:**
- `belum`: Belum diminum
- `sudah`: Sudah diminum
- `terlewat`: Terlewat/lupa diminum

---

## 🔍 Contoh Query

### ✅ Melihat Semua User
```sql
SELECT * FROM users;
```

### ✅ Melihat Konsultasi User Tertentu
```sql
SELECT * FROM consultations 
WHERE user_id = 1 
ORDER BY tanggal_konsultasi DESC;
```

### ✅ Hitung Total Konsultasi per User
```sql
SELECT 
    u.nama_lengkap, 
    COUNT(c.id) as total_konsultasi 
FROM users u 
LEFT JOIN consultations c ON u.id = c.user_id 
GROUP BY u.id;
```

### ✅ Lihat Obat dan Pengingat
```sql
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    r.waktu_pengingat,
    r.status_diminum,
    r.tanggal_diminum
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
WHERE r.tanggal_diminum = CURDATE()
ORDER BY r.waktu_pengingat;
```

### ✅ Cari Konsultasi dengan Status Darurat
```sql
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
WHERE c.status_darurat IN ('warning', 'urgent')
ORDER BY c.tanggal_konsultasi DESC;
```

### ✅ Update Stok Obat
```sql
UPDATE medications 
SET stok_saat_ini = stok_saat_ini - 1 
WHERE id = 1;
```

### ✅ Tandai Obat Sudah Diminum
```sql
UPDATE reminders 
SET status_diminum = 'sudah' 
WHERE id = 1;
```

---

## 💡 Tips Penggunaan

### ✨ View untuk Laporan (Sudah Dibuat)

Aplikasi sudah menyediakan 2 views:

1. **`v_latest_consultations`** - Konsultasi terbaru per user
   ```sql
   SELECT * FROM v_latest_consultations;
   ```

2. **`v_today_reminders`** - Pengingat obat hari ini
   ```sql
   SELECT * FROM v_today_reminders;
   ```

### 🔐 Backup Database

**Cara Backup:**
```bash
# PowerShell
mysqldump -u root kos_sickness_db > "c:\xampp\htdocs\Kos_Sickness2\database\backup_$(Get-Date -Format yyyyMMdd).sql"
```

### 🔄 Reset Database (Hapus dan Buat Ulang)

```sql
DROP DATABASE IF EXISTS kos_sickness_db;
-- Kemudian import file SQL lagi
```

### 📱 Koneksi dari Backend Node.js

Pastikan file backend memiliki config seperti:

```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // kosong jika default
  database: 'kos_sickness_db'
});
```

---

## 🎯 Dummy Data yang Sudah Ada

### Users:
- ✅ Shabrina Aulia (ID: 1)
- ✅ Uswatun Aulia (ID: 2)
- ✅ Ahmad Rizki (ID: 3) - untuk testing

### Consultations:
- ✅ 2 konsultasi dari Shabrina (sakit kepala, batuk)
- ✅ 1 konsultasi dari Uswatun (perut kembung)

### Medications:
- ✅ 3 obat untuk Shabrina
- ✅ 2 obat untuk Uswatun

### Reminders:
- ✅ 5 pengingat untuk Shabrina
- ✅ 2 pengingat untuk Uswatun

---

## ⚠️ Troubleshooting

### Error: "Access Denied"
- Pastikan MySQL sudah running (XAMPP Control Panel)
- Username: `root`, Password: kosong (default)

### Error: "Database Already Exists"
- Hapus dulu di phpMyAdmin atau jalankan: `DROP DATABASE kos_sickness_db;`

### Error: "Foreign Key Constraint Failed"
- Pastikan `user_id` sudah ada di tabel `users`
- Jangan delete user yang masih punya consultations/medications

### Charset Issue (Karakter Aneh)
- Gunakan UTF-8 untuk collation
- Pastikan phpMyAdmin setting: utf8mb4

---

## 📞 Support

Jika ada masalah:
1. Cek apakah MySQL running di XAMPP
2. Verifikasi file SQL tidak corrupted
3. Gunakan method import yang berbeda
4. Lihat error message di phpMyAdmin

---

**Created for: Kos-Sickness UTS AI Project**  
**By: Shabrina Aulia & Uswatun Aulia**  
**Institution: Universitas Stikubank Semarang**
