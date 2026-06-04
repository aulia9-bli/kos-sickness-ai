# 🚀 PANDUAN SETUP DATABASE MYSQL

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Langkah Setup](#langkah-setup)
3. [Verifikasi Database](#verifikasi-database)
4. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Pastikan sudah ada:
- ✅ XAMPP (dengan MySQL & phpMyAdmin)
- ✅ MySQL Service berjalan
- ✅ File: `database/kos_sickness_db.sql`
- ✅ Backend Node.js project sudah di-setup

---

## 🔧 Langkah Setup

### STEP 1: Pastikan XAMPP Berjalan

1. **Buka XAMPP Control Panel**
   ```
   C:\xampp\xampp-control.exe
   ```

2. **Start Apache & MySQL**
   - Klik "Start" di Apache
   - Klik "Start" di MySQL
   - Status akan berubah hijau

3. **Verifikasi MySQL Berjalan**
   ```
   Services sudah berjalan jika status:
   - Apache: ✅ Running (Port 80)
   - MySQL: ✅ Running (Port 3306)
   ```

---

### STEP 2: Akses phpMyAdmin

1. **Buka Browser**
   - Ketik: `http://localhost/phpmyadmin`
   - Atau: `http://127.0.0.1/phpmyadmin`

2. **Login**
   - Username: `root`
   - Password: (kosongkan - tekan Enter)
   - Klik **Go** atau **Login**

3. **Tampilan Utama**
   - Sebelah kiri: Sidebar dengan list database
   - Atas: Menu (Database, SQL, Export, Import, etc)

---

### STEP 3: Import Database SQL

#### Method A: Upload File (RECOMMENDED)

1. **Di phpMyAdmin, Klik Tab "Import"**
   
2. **Di bagian "File to import"**
   - Klik **"Choose File"** atau **Browse**
   - Navigate ke: 
     ```
     c:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql
     ```
   - Klik Open/Select

3. **Konfigurasi Import**
   - Charset: **utf8mb4** (sudah default)
   - Lainnya biarkan default
   - Klik **"Go"** atau **"Impor"**

4. **Tunggu Proses Selesai**
   ```
   Query executed successfully:
   CREATE DATABASE
   CREATE TABLE users
   CREATE TABLE consultations
   CREATE TABLE medications
   CREATE TABLE reminders
   INSERT INTO users ...
   [dan seterusnya]
   ```

#### Method B: Copy-Paste Query

1. **Buka Tab "SQL"**
   - Di phpMyAdmin, klik tab SQL

2. **Copy isi file SQL**
   - Buka file: `database/kos_sickness_db.sql`
   - Ctrl+A (select all)
   - Ctrl+C (copy)

3. **Paste ke phpMyAdmin**
   - Klik di text area di phpMyAdmin
   - Ctrl+V (paste)
   - Klik **"Go"**

4. **Tunggu selesai**

#### Method C: Command Line (Advanced)

```powershell
# Buka PowerShell sebagai Admin
cd C:\xampp\mysql\bin

# Import database
mysql -u root kos_sickness_db < "C:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql"

# Atau dengan full path jika error
"C:\xampp\mysql\bin\mysql.exe" -u root kos_sickness_db < "C:\xampp\htdocs\Kos_Sickness2\database\kos_sickness_db.sql"
```

---

### STEP 4: Verifikasi Database Berhasil Di-import

1. **Di phpMyAdmin Sidebar Kiri**
   - Refresh jika belum muncul
   - Cari database: **`kos_sickness_db`**
   - Klik untuk expand

2. **Lihat 4 Tabel**
   ```
   kos_sickness_db
   ├── consultations
   ├── medications
   ├── reminders
   └── users
   ```

3. **Klik Masing-masing Tabel**
   - Lihat struktur (tab "Structure")
   - Lihat data (tab "Browse")
   - Seharusnya sudah ada dummy data

---

### STEP 5: Update Backend .env (Jika Belum)

File sudah tersedia di: `backend/.env`

Pastikan berisi:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kos_sickness_db
DB_PORT=3306
```

---

### STEP 6: Install Database Package di Backend

Jika belum, install mysql2 package:

```bash
# Di terminal, masuk folder backend
cd c:\xampp\htdocs\Kos_Sickness2\backend

# Install package
npm install mysql2

# Atau dengan promise support
npm install mysql2/promise
```

---

## ✔️ Verifikasi Database

### Verifikasi 1: Cek Tabel Users

```sql
-- Di phpMyAdmin tab SQL, jalankan query ini:
SELECT * FROM users;
```

**Expected Output:**
```
id | nama_lengkap   | email                  | universitas | alamat_kos        | kecamatan_semarang
1  | Shabrina Aulia | shabrina.aulia@...     | Unistikum   | Kos Putri Indah   | Candisari
2  | Uswatun Aulia  | uswatun.aulia@...      | Unistikum   | Kos Ceria         | Gajahmungkur
3  | Ahmad Rizki    | ahmad.rizki@...        | Unistikum   | Kos Eksis         | Semarang Timur
```

### Verifikasi 2: Cek Consultations

```sql
SELECT * FROM consultations;
```

**Expected Output:** 3 baris data (2 dari Shabrina, 1 dari Uswatun)

### Verifikasi 3: Cek Medications

```sql
SELECT * FROM medications;
```

**Expected Output:** 5 baris data (3 untuk Shabrina, 2 untuk Uswatun)

### Verifikasi 4: Cek Reminders

```sql
SELECT * FROM reminders;
```

**Expected Output:** 7 baris data

### Verifikasi 5: Test Foreign Key

```sql
-- Cek apakah data terintegrasi dengan baik
SELECT 
    u.nama_lengkap,
    COUNT(c.id) as total_konsultasi,
    COUNT(m.id) as jumlah_obat
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
GROUP BY u.id;
```

**Expected Output:**
```
nama_lengkap    | total_konsultasi | jumlah_obat
Shabrina Aulia  | 2                | 3
Uswatun Aulia   | 1                | 2
Ahmad Rizki     | 0                | 0
```

---

## 🐛 Troubleshooting

### ❌ Error: "Access Denied for user 'root'@'localhost'"

**Penyebab:** MySQL tidak berjalan atau username/password salah

**Solusi:**
1. Pastikan MySQL Service berjalan di XAMPP Control Panel
2. Cek password di XAMPP (default kosong)
3. Verifikasi username (default `root`)

```bash
# Test koneksi direct
mysql -u root -p
# Tekan Enter jika password kosong
```

---

### ❌ Error: "Database 'kos_sickness_db' already exists"

**Penyebab:** Database sudah pernah di-import

**Solusi Option 1: Drop database lama**
```sql
DROP DATABASE IF EXISTS kos_sickness_db;
-- Kemudian import ulang file SQL
```

**Solusi Option 2: Gunakan fresh database**
```bash
# Di phpMyAdmin, hapus database kos_sickness_db
# Atau direct query:
DROP DATABASE kos_sickness_db;
```

---

### ❌ Error: "Syntax Error in SQL"

**Penyebab:** File SQL corrupted atau encoding salah

**Solusi:**
1. Verifikasi file SQL tidak corrupted
2. Download ulang file SQL dari repository
3. Gunakan Method C (Command Line) untuk import
4. Pastikan file tidak ada BOM (Byte Order Mark)

---

### ❌ Error: "Lost connection to MySQL server"

**Penyebab:** MySQL timeout atau connection reset

**Solusi:**
1. Restart MySQL di XAMPP Control Panel
2. Cek koneksi timeout di database config
3. Verifikasi database size tidak terlalu besar (tidak masalah untuk test)

---

### ❌ Error: "Character Set 'utf8mb4' is not supported"

**Penyebab:** MySQL version lama tidak support utf8mb4

**Solusi:**
1. Update MySQL XAMPP ke version terbaru
2. Atau ubah di file SQL:
   ```sql
   CHARACTER SET utf8 -- ganti dari utf8mb4
   COLLATE utf8_general_ci -- ganti dari utf8mb4_unicode_ci
   ```

---

### ❌ Error: "Cannot add or update a child row"

**Penyebab:** Foreign key constraint violation

**Solusi:**
1. Pastikan parent record sudah ada
2. Contoh: jangan insert consultations dengan user_id yang tidak ada
3. Atau temporary disable foreign key check:
   ```sql
   SET FOREIGN_KEY_CHECKS=0;
   -- [insert data]
   SET FOREIGN_KEY_CHECKS=1;
   ```

---

### ❌ phpMyAdmin Tidak Bisa Diakses

**Penyebab:** Apache atau MySQL tidak berjalan

**Solusi:**
```bash
# Pastikan Apache running
# Di XAMPP Control Panel, klik Start di Apache

# Atau start manual
cd C:\xampp\apache\bin
httpd.exe

# Kemudian akses:
http://localhost/phpmyadmin
```

---

## 📱 Test Koneksi dari Backend

Buat file test: `backend/test-db.js`

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kos_sickness_db'
    });

    console.log('✅ Koneksi berhasil!');

    // Test query
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('Jumlah users:', rows.length);
    console.log('Users:', rows);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
```

Run test:
```bash
node test-db.js
```

---

## 📊 Database Status

### Kapasitas
- **Database Size**: ~50 KB (untuk test data)
- **Max Connections**: 10 (dapat diubah di config)
- **Character Set**: UTF-8 MB4 (support emoji)

### Performance
- **Indexes**: 6 buah (sudah optimal)
- **Foreign Keys**: 3 relationships
- **Views**: 2 buah (untuk reporting)

### Backup & Recovery
- **Auto Backup**: Tidak ada (setup manual jika perlu)
- **Bahasa Query**: Indonesian dengan dokumentasi
- **Documentation**: Complete di README_DATABASE.md

---

## 🎯 Checklist Setup

- [ ] XAMPP installed & running
- [ ] MySQL service berjalan (hijau di XAMPP Control Panel)
- [ ] phpMyAdmin accessible (http://localhost/phpmyadmin)
- [ ] File `kos_sickness_db.sql` ada
- [ ] Database berhasil di-import
- [ ] Verifikasi: 4 tabel ada (users, consultations, medications, reminders)
- [ ] Verifikasi: Dummy data ada (3 users, 3 consultations, 5 medications, 7 reminders)
- [ ] Backend `.env` updated dengan DB config
- [ ] Package `mysql2` installed
- [ ] Test koneksi dari backend berhasil ✅

---

## 📞 Quick Reference

| Perintah | Fungsi |
|----------|--------|
| `http://localhost/phpmyadmin` | Akses phpMyAdmin |
| `mysql -u root` | Connect via CLI |
| `SHOW DATABASES;` | Lihat semua database |
| `USE kos_sickness_db;` | Gunakan database |
| `SHOW TABLES;` | Lihat semua tabel |
| `DESC users;` | Lihat struktur tabel |
| `SELECT * FROM users;` | Lihat data users |

---

**Database Setup Guide untuk Kos-Sickness UTS AI Project**  
**Created by: Shabrina Aulia & Uswatun Aulia**  
**Institution: Universitas Stikubank Semarang**
