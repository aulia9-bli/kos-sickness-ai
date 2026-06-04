-- ============================================
-- KOS-SICKNESS DATABASE EXAMPLE QUERIES
-- File: database/QUERY_EXAMPLES.sql
-- 
-- Kumpulan query siap pakai untuk berbagai kebutuhan
-- Copy-paste langsung ke phpMyAdmin SQL tab
-- ============================================

-- ============================================
-- 1️⃣ BASIC QUERIES (Query Dasar)
-- ============================================

-- Lihat semua user
SELECT * FROM users;

-- Lihat user dari universitas tertentu
SELECT * FROM users WHERE universitas LIKE '%Stikubank%';

-- Lihat user dari kecamatan tertentu
SELECT * FROM users WHERE kecamatan_semarang = 'Candisari';

-- Cari user berdasarkan nama
SELECT * FROM users WHERE nama_lengkap LIKE '%Shabrina%';

-- Lihat semua konsultasi
SELECT * FROM consultations ORDER BY tanggal_konsultasi DESC;

-- Lihat semua obat
SELECT * FROM medications;

-- Lihat semua pengingat
SELECT * FROM reminders;

-- ============================================
-- 2️⃣ CONSULTATION QUERIES (Query Konsultasi)
-- ============================================

-- Konsultasi dari user tertentu (Shabrina)
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.gejala_tambahan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
WHERE u.id = 1
ORDER BY c.tanggal_konsultasi DESC;

-- Lihat konsultasi dengan status DARURAT/URGENT
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
WHERE c.status_darurat IN ('warning', 'urgent')
ORDER BY c.tanggal_konsultasi DESC;

-- Hitung total konsultasi per user
SELECT 
    u.nama_lengkap,
    COUNT(c.id) as total_konsultasi,
    MAX(c.tanggal_konsultasi) as konsultasi_terakhir
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
GROUP BY u.id
ORDER BY total_konsultasi DESC;

-- Lihat konsultasi 7 hari terakhir
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
WHERE c.tanggal_konsultasi >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY c.tanggal_konsultasi DESC;

-- Lihat pola gejala (keluhan paling sering)
SELECT 
    keluhan,
    COUNT(*) as frekuensi,
    MAX(tanggal_konsultasi) as terakhir_dilaporkan
FROM consultations
GROUP BY keluhan
ORDER BY frekuensi DESC;

-- Lihat status darurat distribution
SELECT 
    status_darurat,
    COUNT(*) as jumlah,
    ROUND(COUNT(*) * 100 / (SELECT COUNT(*) FROM consultations), 2) as persentase
FROM consultations
GROUP BY status_darurat;

-- ============================================
-- 3️⃣ MEDICATION QUERIES (Query Obat-Obatan)
-- ============================================

-- Lihat semua obat user tertentu
SELECT * FROM medications WHERE user_id = 1;

-- Obat yang hampir habis (stok < 5)
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    m.stok_saat_ini,
    m.stok_awal
FROM medications m
JOIN users u ON m.user_id = u.id
WHERE m.stok_saat_ini < 5
ORDER BY m.stok_saat_ini ASC;

-- Lihat total stok semua obat per user
SELECT 
    u.nama_lengkap,
    COUNT(m.id) as jumlah_jenis_obat,
    SUM(m.stok_saat_ini) as total_stok
FROM users u
LEFT JOIN medications m ON u.id = m.user_id
GROUP BY u.id;

-- Jenis obat paling banyak dimiliki user
SELECT 
    nama_obat,
    COUNT(*) as user_dengan_obat,
    ROUND(AVG(stok_saat_ini), 2) as rata_rata_stok
FROM medications
GROUP BY nama_obat
ORDER BY user_dengan_obat DESC;

-- Lihat progress pemakaian obat (stok berkurang dari stok awal)
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.stok_awal,
    m.stok_saat_ini,
    (m.stok_awal - m.stok_saat_ini) as diminum,
    ROUND(((m.stok_awal - m.stok_saat_ini) / m.stok_awal * 100), 1) as persentase_diminum,
    m.created_at,
    m.updated_at
FROM medications m
JOIN users u ON m.user_id = u.id
WHERE m.stok_awal > 0
ORDER BY persentase_diminum DESC;

-- ============================================
-- 4️⃣ REMINDER QUERIES (Query Pengingat)
-- ============================================

-- Lihat pengingat hari ini
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    r.waktu_pengingat,
    r.status_diminum,
    r.keterangan
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
WHERE r.tanggal_diminum = CURDATE()
ORDER BY r.waktu_pengingat ASC;

-- Pengingat yang belum diminum (pending)
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    r.waktu_pengingat,
    r.tanggal_diminum
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
WHERE r.status_diminum = 'belum'
AND r.tanggal_diminum <= CURDATE()
ORDER BY r.tanggal_diminum DESC, r.waktu_pengingat ASC;

-- Pengingat yang terlewat (lupa diminum)
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    r.tanggal_diminum,
    r.waktu_pengingat
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
WHERE r.status_diminum = 'terlewat'
ORDER BY r.tanggal_diminum DESC;

-- Compliance rate (tingkat kepatuhan minum obat)
SELECT 
    u.nama_lengkap,
    COUNT(*) as total_pengingat,
    SUM(CASE WHEN r.status_diminum = 'sudah' THEN 1 ELSE 0 END) as diminum,
    SUM(CASE WHEN r.status_diminum = 'belum' THEN 1 ELSE 0 END) as belum,
    SUM(CASE WHEN r.status_diminum = 'terlewat' THEN 1 ELSE 0 END) as terlewat,
    ROUND(SUM(CASE WHEN r.status_diminum = 'sudah' THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as compliance_rate
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
GROUP BY u.id;

-- Jadwal pengingat paling sering
SELECT 
    waktu_pengingat,
    COUNT(*) as jumlah_pengingat
FROM reminders
GROUP BY waktu_pengingat
ORDER BY jumlah_pengingat DESC;

-- ============================================
-- 5️⃣ INTEGRATED QUERIES (Query Terintegrasi)
-- ============================================

-- Dashboard user lengkap
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    COUNT(DISTINCT c.id) as total_konsultasi,
    MAX(c.tanggal_konsultasi) as konsultasi_terakhir,
    COUNT(DISTINCT m.id) as jumlah_obat,
    SUM(m.stok_saat_ini) as total_stok_obat,
    COUNT(DISTINCT r.id) as total_pengingat
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
LEFT JOIN reminders r ON m.id = r.medication_id
GROUP BY u.id;

-- User + konsultasi terbaru + obat
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi,
    m.nama_obat,
    m.dosis,
    m.stok_saat_ini
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
WHERE c.tanggal_konsultasi = (
    SELECT MAX(c2.tanggal_konsultasi) 
    FROM consultations c2 
    WHERE c2.user_id = u.id
)
OR c.id IS NULL
ORDER BY u.id;

-- Laporan lengkap: user, konsultasi, obat, dan pengingat
SELECT 
    u.nama_lengkap,
    COUNT(DISTINCT c.id) as total_konsultasi,
    c.keluhan as konsultasi_terbaru,
    c.status_darurat,
    COUNT(DISTINCT m.id) as jumlah_jenis_obat,
    SUM(m.stok_saat_ini) as total_stok,
    COUNT(r.id) as total_pengingat,
    SUM(CASE WHEN r.status_diminum = 'sudah' THEN 1 ELSE 0 END) as pengingat_sudah,
    SUM(CASE WHEN r.status_diminum = 'belum' THEN 1 ELSE 0 END) as pengingat_belum
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
LEFT JOIN medications m ON u.id = m.user_id
LEFT JOIN reminders r ON m.id = r.medication_id
GROUP BY u.id
ORDER BY total_konsultasi DESC;

-- ============================================
-- 6️⃣ STATISTICS & ANALYTICS (Query Statistik)
-- ============================================

-- Statistik umum database
SELECT 
    (SELECT COUNT(*) FROM users) as total_user,
    (SELECT COUNT(*) FROM consultations) as total_konsultasi,
    (SELECT COUNT(*) FROM medications) as total_obat,
    (SELECT COUNT(*) FROM reminders) as total_pengingat;

-- Rata-rata konsultasi per user
SELECT 
    ROUND(AVG(konsultasi_per_user), 2) as rata_rata_konsultasi,
    MAX(konsultasi_per_user) as konsultasi_max,
    MIN(konsultasi_per_user) as konsultasi_min
FROM (
    SELECT COUNT(*) as konsultasi_per_user
    FROM consultations
    GROUP BY user_id
) as stats;

-- Timeline konsultasi (per tanggal)
SELECT 
    DATE(tanggal_konsultasi) as tanggal,
    COUNT(*) as jumlah_konsultasi,
    SUM(CASE WHEN status_darurat = 'urgent' THEN 1 ELSE 0 END) as urgent,
    SUM(CASE WHEN status_darurat = 'warning' THEN 1 ELSE 0 END) as warning,
    SUM(CASE WHEN status_darurat = 'normal' THEN 1 ELSE 0 END) as normal
FROM consultations
GROUP BY DATE(tanggal_konsultasi)
ORDER BY tanggal DESC;

-- Trend kesehatan user (berdasarkan konsultasi)
SELECT 
    u.nama_lengkap,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi,
    LAG(c.status_darurat) OVER (PARTITION BY u.id ORDER BY c.tanggal_konsultasi) as status_sebelumnya
FROM consultations c
JOIN users u ON c.user_id = u.id
ORDER BY u.id, c.tanggal_konsultasi DESC;

-- ============================================
-- 7️⃣ DATA MAINTENANCE QUERIES (Query Maintenance)
-- ============================================

-- Hapus konsultasi lebih dari 30 hari yang lalu
DELETE FROM consultations 
WHERE tanggal_konsultasi < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Update stok obat (contoh: kurangi 1)
UPDATE medications 
SET stok_saat_ini = stok_saat_ini - 1 
WHERE id = 1 AND stok_saat_ini > 0;

-- Tandai pengingat sudah diminum
UPDATE reminders 
SET status_diminum = 'sudah' 
WHERE id = 1 AND status_diminum = 'belum';

-- Tandai pengingat terlewat (yang sudah lewat waktu dan belum diminum)
UPDATE reminders 
SET status_diminum = 'terlewat' 
WHERE status_diminum = 'belum' 
AND tanggal_diminum < CURDATE();

-- Reset semua pengingat status untuk testing
UPDATE reminders SET status_diminum = 'belum' WHERE status_diminum IN ('sudah', 'terlewat');

-- ============================================
-- 8️⃣ ADVANCED QUERIES (Query Lanjutan)
-- ============================================

-- Cari user dengan konsultasi URGENT yang belum direspon
SELECT 
    u.nama_lengkap,
    u.no_hp_darurat,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi,
    TIMESTAMPDIFF(HOUR, c.tanggal_konsultasi, NOW()) as jam_sejak_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
WHERE c.status_darurat = 'urgent'
ORDER BY c.tanggal_konsultasi ASC;

-- User dengan medication adherence terendah
SELECT 
    u.nama_lengkap,
    COUNT(r.id) as total_pengingat,
    SUM(CASE WHEN r.status_diminum = 'sudah' THEN 1 ELSE 0 END) as diminum,
    ROUND(SUM(CASE WHEN r.status_diminum = 'sudah' THEN 1 ELSE 0 END) / COUNT(r.id) * 100, 1) as adherence_rate
FROM users u
JOIN medications m ON u.id = m.user_id
LEFT JOIN reminders r ON m.id = r.medication_id
GROUP BY u.id
HAVING COUNT(r.id) > 0
ORDER BY adherence_rate ASC;

-- Rekomendasi reminder time berdasarkan pattern
SELECT 
    HOUR(waktu_pengingat) as jam,
    COUNT(*) as jumlah_reminder
FROM reminders
GROUP BY HOUR(waktu_pengingat)
ORDER BY jumlah_reminder DESC;

-- ============================================
-- 9️⃣ EXPORT/REPORT QUERIES (Query Report)
-- ============================================

-- Report: Semua user dengan detail lengkap
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    u.universitas,
    u.alamat_kos,
    u.kecamatan_semarang,
    u.no_hp_darurat,
    u.created_at
FROM users u
ORDER BY u.created_at DESC;

-- Report: Semua konsultasi dengan detail
SELECT 
    c.id,
    u.nama_lengkap,
    c.keluhan,
    c.gejala_tambahan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM consultations c
JOIN users u ON c.user_id = u.id
ORDER BY c.tanggal_konsultasi DESC;

-- Report: Inventory obat
SELECT 
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    m.stok_awal,
    m.stok_saat_ini,
    (m.stok_awal - m.stok_saat_ini) as terpakai,
    m.created_at
FROM medications m
JOIN users u ON m.user_id = u.id
ORDER BY u.nama_lengkap, m.created_at DESC;

-- ============================================
-- END OF EXAMPLE QUERIES
-- ============================================

-- Tips:
-- 1. Copy query yang diinginkan
-- 2. Buka phpMyAdmin → Tab SQL
-- 3. Paste query
-- 4. Klik "Go" atau "Jalankan"
-- 5. Lihat hasil di bawah
--
-- Catatan:
-- - CURDATE() = hari ini
-- - NOW() = waktu saat ini
-- - DATE_SUB() = pengurangan tanggal
-- - TIMESTAMPDIFF() = selisih waktu
-- - LAG() = baris sebelumnya (untuk trend)
