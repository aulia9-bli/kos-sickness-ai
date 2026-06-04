# 📐 Entity Relationship Diagram (ERD)
# Kos-Sickness Database

## Visual Relationship

```
╔═════════════════════════════════════╗
║         USERS                       ║
║ (Tabel Pengguna)                   ║
╠═════════════════════════════════════╣
║ PK  id (INT)                       ║
║     nama_lengkap (VARCHAR)         ║
║     email (VARCHAR) UNIQUE         ║
║     universitas (VARCHAR)          ║
║     alamat_kos (TEXT)              ║
║     kecamatan_semarang (VARCHAR)   ║
║     no_hp_darurat (VARCHAR)        ║
║     created_at (TIMESTAMP)         ║
╚════════┬════════════════════════════╝
         │ (1:N) "memiliki"
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
╔═════════════════════════════════════╗  ╔═════════════════════════════════════╗
║   CONSULTATIONS                     ║  ║   MEDICATIONS                       ║
║ (Riwayat Konsultasi)               ║  ║ (Data Obat-Obatan)                ║
╠═════════════════════════════════════╣  ╠═════════════════════════════════════╣
║ PK  id (INT)                       ║  ║ PK  id (INT)                       ║
║ FK  user_id (INT)                  ║  ║ FK  user_id (INT)                  ║
║     keluhan (TEXT)                 ║  ║     nama_obat (VARCHAR)            ║
║     gejala_tambahan (TEXT)         ║  ║     dosis (VARCHAR)                ║
║     saran_awal (LONGTEXT)          ║  ║     stok_awal (INT)                ║
║     status_darurat (ENUM)          ║  ║     stok_saat_ini (INT)            ║
║     tanggal_konsultasi (TIMESTAMP) ║  ║     created_at (TIMESTAMP)         ║
║                                    ║  ║     updated_at (TIMESTAMP)         ║
║ Status Darurat:                    ║  ╚════════┬═══════════════════════════╝
║ • normal (ringan)                  ║         │ (1:N) "memiliki"
║ • warning (sedang)                 ║         │
║ • urgent (berat)                   ║         ▼
╚════════════════════════════════════╝  ╔═════════════════════════════════════╗
                                        ║       REMINDERS                     ║
                                        ║ (Pengingat Minum Obat)            ║
                                        ╠═════════════════════════════════════╣
                                        ║ PK  id (INT)                       ║
                                        ║ FK  medication_id (INT)            ║
                                        ║     waktu_pengingat (TIME)         ║
                                        ║     status_diminum (ENUM)          ║
                                        ║     tanggal_diminum (DATE)         ║
                                        ║     keterangan (TEXT)              ║
                                        ║     created_at (TIMESTAMP)         ║
                                        ║                                    ║
                                        ║ Status Diminum:                    ║
                                        ║ • belum (belum diminum)            ║
                                        ║ • sudah (sudah diminum)            ║
                                        ║ • terlewat (lupa/terlewat)         ║
                                        ╚════════════════════════════════════╝
```

## Relationship Details

### 1️⃣ USERS → CONSULTATIONS (1:N)
- **Cardinalitas**: Satu User dapat memiliki banyak Consultations
- **Foreign Key**: `consultations.user_id` → `users.id`
- **Cascade**: ON DELETE CASCADE (jika user dihapus, consultations ikut terhapus)
- **Interpretasi**: Satu mahasiswa dapat berkonsultasi berkali-kali

**Contoh:**
```
User: Shabrina Aulia
├─ Consultation 1: Sakit kepala, pusing, demam (Feb 10)
├─ Consultation 2: Batuk, pilek (Feb 15)
└─ Consultation 3: Demam lagi (Feb 20)
```

### 2️⃣ USERS → MEDICATIONS (1:N)
- **Cardinalitas**: Satu User dapat memiliki banyak Medications
- **Foreign Key**: `medications.user_id` → `users.id`
- **Cascade**: ON DELETE CASCADE
- **Interpretasi**: Satu mahasiswa dapat memiliki beberapa jenis obat

**Contoh:**
```
User: Shabrina Aulia
├─ Medication 1: Paracetamol 500mg
├─ Medication 2: Obat Batuk Sirup
└─ Medication 3: Ibuprofen 400mg
```

### 3️⃣ MEDICATIONS → REMINDERS (1:N)
- **Cardinalitas**: Satu Medication dapat memiliki banyak Reminders
- **Foreign Key**: `reminders.medication_id` → `medications.id`
- **Cascade**: ON DELETE CASCADE
- **Interpretasi**: Satu obat dapat memiliki beberapa jadwal pengingat per hari

**Contoh:**
```
Medication: Paracetamol 500mg
├─ Reminder 1: 08:00 - Setelah sarapan
└─ Reminder 2: 20:00 - Sebelum tidur
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  USER JOURNEY                                          │
└─────────────────────────────────────────────────────────┘

1. User Registrasi
   └─→ INSERT ke tabel USERS
       (nama, email, universitas, alamat, no_hp, etc)

2. User Input Keluhan
   └─→ INSERT ke tabel CONSULTATIONS
       (keluhan, gejala_tambahan)
       ├─→ AI Groq memberikan saran
       └─→ UPDATE saran_awal + status_darurat

3. User Dapatkan Rekomendasi Obat
   └─→ INSERT ke tabel MEDICATIONS
       (nama_obat, dosis, stok)

4. User Atur Pengingat Minum Obat
   └─→ INSERT ke tabel REMINDERS
       (waktu_pengingat, status_diminum)

5. User Track Status Pengingat
   └─→ UPDATE status_diminum
       (belum → sudah, atau belum → terlewat)

6. Query untuk Laporan
   └─→ SELECT & JOIN antar tabel
       untuk analytics dan reporting
```

## Index Strategy

Database sudah memiliki index untuk performa optimal:

```sql
-- Users
- PRIMARY KEY: id
- INDEX: email (untuk login/search cepat)
- INDEX: universitas (untuk filter)

-- Consultations  
- PRIMARY KEY: id
- FOREIGN KEY: user_id
- INDEX: (status_darurat, tanggal_konsultasi) 
  → untuk query konsultasi darurat terbaru
- INDEX: tanggal_konsultasi 
  → untuk sorting/report
- INDEX: status_darurat 
  → untuk filter

-- Medications
- PRIMARY KEY: id
- FOREIGN KEY: user_id
- INDEX: (user_id, created_at) 
  → untuk list obat per user sorted by date

-- Reminders
- PRIMARY KEY: id
- FOREIGN KEY: medication_id
- INDEX: status_diminum 
  → untuk filter status
- INDEX: tanggal_diminum 
  → untuk query reminder hari ini
- INDEX: (status_diminum, tanggal_diminum) 
  → untuk tracking harian
```

## Constraint Rules

### Primary Key Constraints
```
users.id                  → AUTO INCREMENT
consultations.id          → AUTO INCREMENT
medications.id            → AUTO INCREMENT
reminders.id              → AUTO INCREMENT
```

### Unique Constraints
```
users.email               → UNIQUE (satu email hanya satu user)
```

### Foreign Key Constraints
```
consultations.user_id     → REFERENCES users.id (ON DELETE CASCADE)
medications.user_id       → REFERENCES users.id (ON DELETE CASCADE)
reminders.medication_id   → REFERENCES medications.id (ON DELETE CASCADE)
```

### Enum Constraints
```
consultations.status_darurat  → ('normal', 'warning', 'urgent')
reminders.status_diminum      → ('belum', 'sudah', 'terlewat')
```

## Normalization Level

Database mengikuti standar **3NF (Third Normal Form)**:

✅ **1NF**: Semua atribut atomic (tidak multivalued)
✅ **2NF**: Semua non-key attributes fully dependent on primary key
✅ **3NF**: Tidak ada transitive dependencies

## Sample Queries Based on ERD

### Query 1: Lihat konsultasi user beserta obat-obatan yang direkomendasikan
```sql
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.saran_awal,
    c.status_darurat,
    COUNT(m.id) as jumlah_obat
FROM users u
JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
GROUP BY c.id;
```

### Query 2: Lihat user dengan tracking obat lengkap
```sql
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    r.waktu_pengingat,
    r.status_diminum,
    r.tanggal_diminum
FROM users u
JOIN medications m ON u.id = m.user_id
LEFT JOIN reminders r ON m.id = r.medication_id
ORDER BY u.id, r.tanggal_diminum, r.waktu_pengingat;
```

### Query 3: Statistik konsultasi dan obat per user
```sql
SELECT 
    u.nama_lengkap,
    COUNT(DISTINCT c.id) as total_konsultasi,
    COUNT(DISTINCT m.id) as jumlah_obat,
    MAX(c.tanggal_konsultasi) as konsultasi_terakhir
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
GROUP BY u.id;
```

---

**Database Design Created for: Kos-Sickness UTS AI Project**
