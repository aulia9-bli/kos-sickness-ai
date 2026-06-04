-- ============================================
-- DATABASE SCHEMA FOR KOS-SICKNESS APPLICATION
-- Universitas Stikubank Semarang - UTS AI Project
-- Dibuat oleh: Shabrina Aulia & Uswatun Aulia
-- ============================================

-- Drop database if exists (untuk reset/fresh install)
DROP DATABASE IF EXISTS `kos_sickness_db`;

-- Create new database
CREATE DATABASE `kos_sickness_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use database
USE `kos_sickness_db`;

-- ============================================
-- TABLE 1: USERS (Mahasiswa/Pengguna)
-- ============================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID Unik User',
  `nama_lengkap` VARCHAR(255) NOT NULL COMMENT 'Nama lengkap pengguna',
  `email` VARCHAR(255) UNIQUE COMMENT 'Email pengguna (unik)',
  `universitas` VARCHAR(255) NOT NULL COMMENT 'Nama universitas',
  `alamat_kos` TEXT NOT NULL COMMENT 'Alamat tempat tinggal/kos',
  `kecamatan_semarang` VARCHAR(100) COMMENT 'Kecamatan di Semarang',
  `no_hp_darurat` VARCHAR(20) NOT NULL COMMENT 'Nomor HP darurat',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Tanggal pembuatan akun',
  INDEX `idx_email` (`email`),
  INDEX `idx_universitas` (`universitas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel data pengguna aplikasi Kos-Sickness';

-- ============================================
-- TABLE 2: CONSULTATIONS (Konsultasi Kesehatan)
-- ============================================
CREATE TABLE `consultations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID Unik Konsultasi',
  `user_id` INT NOT NULL COMMENT 'Referensi ke tabel users',
  `keluhan` TEXT NOT NULL COMMENT 'Keluhan utama pengguna',
  `gejala_tambahan` TEXT COMMENT 'Gejala tambahan yang dialami',
  `saran_awal` LONGTEXT NOT NULL COMMENT 'Saran dari AI Groq (respons lengkap)',
  `status_darurat` ENUM('normal', 'warning', 'urgent') DEFAULT 'normal' COMMENT 'Status tingkat keparahan',
  `tanggal_konsultasi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu konsultasi dilakukan',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_tanggal` (`tanggal_konsultasi`),
  INDEX `idx_status` (`status_darurat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel riwayat konsultasi kesehatan';

-- ============================================
-- TABLE 3: MEDICATIONS (Data Obat-Obatan)
-- ============================================
CREATE TABLE `medications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID Unik Obat',
  `user_id` INT NOT NULL COMMENT 'Referensi ke tabel users',
  `nama_obat` VARCHAR(255) NOT NULL COMMENT 'Nama obat',
  `dosis` VARCHAR(100) NOT NULL COMMENT 'Dosis obat (contoh: 500mg, 2x sehari)',
  `stok_awal` INT NOT NULL COMMENT 'Stok awal obat',
  `stok_saat_ini` INT NOT NULL DEFAULT 0 COMMENT 'Stok obat saat ini',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Tanggal obat dicatat',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Tanggal terakhir diupdate',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_nama_obat` (`nama_obat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel data obat-obatan pengguna';

-- ============================================
-- TABLE 4: REMINDERS (Pengingat Minum Obat)
-- ============================================
CREATE TABLE `reminders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID Unik Pengingat',
  `medication_id` INT NOT NULL COMMENT 'Referensi ke tabel medications',
  `waktu_pengingat` TIME NOT NULL COMMENT 'Waktu pengingat minum obat (format HH:MM:SS)',
  `status_diminum` ENUM('belum', 'sudah', 'terlewat') DEFAULT 'belum' COMMENT 'Status apakah obat sudah diminum',
  `tanggal_diminum` DATE COMMENT 'Tanggal pengingat untuk hari ini',
  `keterangan` TEXT COMMENT 'Keterangan atau catatan tambahan',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Tanggal pembuatan reminder',
  FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON DELETE CASCADE,
  INDEX `idx_medication_id` (`medication_id`),
  INDEX `idx_status` (`status_diminum`),
  INDEX `idx_tanggal` (`tanggal_diminum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel pengingat minum obat';

-- ============================================
-- DUMMY DATA (TEST DATA)
-- ============================================

-- Insert users
INSERT INTO `users` (`nama_lengkap`, `email`, `universitas`, `alamat_kos`, `kecamatan_semarang`, `no_hp_darurat`, `created_at`) VALUES
('Shabrina Aulia', 'shabrina.aulia@email.com', 'Universitas Stikubank Semarang', 'Kos Putri Indah, Jl. Letnan Jendral Katamso No. 20', 'Candisari', '08123456789', '2024-01-15 10:30:00'),
('Uswatun Aulia', 'uswatun.aulia@email.com', 'Universitas Stikubank Semarang', 'Kos Ceria, Jl. Pandanaran No. 45', 'Gajahmungkur', '08987654321', '2024-01-16 14:20:00'),
('Ahmad Rizki', 'ahmad.rizki@email.com', 'Universitas Stikubank Semarang', 'Kos Eksis, Jl. Kaligawe No. 12', 'Semarang Timur', '08567890123', '2024-01-17 09:15:00');

-- Insert consultations (Shabrina)
INSERT INTO `consultations` (`user_id`, `keluhan`, `gejala_tambahan`, `saran_awal`, `status_darurat`, `tanggal_konsultasi`) VALUES
(1, 'Sakit kepala, pusing, dan demam tinggi', 'Badan terasa dingin, kurang nafsu makan', 
'**Sakit Kepala, Pusing, dan Demam Tinggi: Saran Pertolongan Pertama**\n\n**Penjelasan Singkat:** Gejala-gejala yang kamu alami mungkin disebabkan oleh infeksi pernapasan atau flu biasa.\n\n**Langkah-Langkah Pertolongan Pertama:**\n1. Minum banyak air: Pastikan kamu minum air yang cukup untuk menjaga tubuh tetap hidrasi.\n2. Gunakan paracetamol atau ibuprofen: Obat-obatan ini dapat membantu mengurangi demam dan sakit kepala (Rp 5.000 - Rp 10.000 di apotek).\n3. Makan makanan ringan: Seperti nasi goreng, mie goreng, atau roti panggang.\n4. Tidur yang cukup: Pastikan kamu tidur yang cukup untuk membantu tubuh pulih.\n\n**Tanda-Tanda Bahaya:** Demam tinggi yang tidak turun, sakit kepala sangat parah, kesulitan bernapas.\n\n**Kapan Harus Ke Dokter?** Jika gejala tidak membaik dalam 2-3 hari atau malah memburuk.', 'warning', '2024-02-10 11:30:00'),
(1, 'Batuk, pilek, dan sulit tidur', 'Tenggorokan terasa gatal, batuk terus-menerus saat malam', 
'**Batuk dan Pilek: Pertolongan Pertama**\n\n**Penyebab:** Kemungkinan infeksi virus pernapasan atau alergi.\n\n**Rekomendasi:**\n1. Minum air hangat dengan madu (Rp 3.000 per botol madu)\n2. Gunakan minyak kayu putih untuk menggosok dada\n3. Istirahat cukup dan hindari debu\n4. Gunakan obat batuk sirup (Rp 8.000-15.000)\n\n**Pencegahan:** Cuci tangan teratur, hindari tempat ramai.', 'normal', '2024-02-15 16:45:00');

-- Insert consultations (Uswatun)
INSERT INTO `consultations` (`user_id`, `keluhan`, `gejala_tambahan`, `saran_awal`, `status_darurat`, `tanggal_konsultasi`) VALUES
(2, 'Perut kembung dan mual', 'Kembung sejak pagi, tidak bisa makan banyak', 
'**Perut Kembung dan Mual: Panduan Pertolongan Pertama**\n\n**Penyebab Umum:** Konsumsi makanan berlemak, stres, atau gangguan pencernaan.\n\n**Langkah Penanganan:**\n1. Istirahat dalam posisi santai\n2. Minum teh hangat (chamomile atau jahe)\n3. Hindari makanan berlemak untuk sementara\n4. Minum obat perut (Rp 5.000 - Rp 12.000)\n\n**Makanan yang Aman:** Nasi putih, telur rebus, ubi.\n\n**Kapan ke dokter:** Jika berlanjut lebih dari 2 hari atau disertai muntah.', 'normal', '2024-02-18 13:20:00');

-- Insert medications (Shabrina)
INSERT INTO `medications` (`user_id`, `nama_obat`, `dosis`, `stok_awal`, `stok_saat_ini`) VALUES
(1, 'Paracetamol', '500mg 2x sehari', 10, 8),
(1, 'Obat Batuk Sirup', '1 sendok makan 3x sehari', 1, 1),
(1, 'Ibuprofen', '400mg 1x sehari', 15, 12);

-- Insert medications (Uswatun)
INSERT INTO `medications` (`user_id`, `nama_obat`, `dosis`, `stok_awal`, `stok_saat_ini`) VALUES
(2, 'Obat Perut', '1 tablet 2x sehari', 20, 18),
(2, 'Minyak Kayu Putih', 'Gosokkan pada dada 2x sehari', 1, 1);

-- Insert reminders for Shabrina's medications
INSERT INTO `reminders` (`medication_id`, `waktu_pengingat`, `status_diminum`, `tanggal_diminum`, `keterangan`) VALUES
(1, '08:00:00', 'sudah', '2024-03-01', 'Minum setelah sarapan'),
(1, '20:00:00', 'belum', '2024-03-01', 'Minum sebelum tidur'),
(2, '12:00:00', 'sudah', '2024-03-01', 'Minum setelah makan siang'),
(3, '19:00:00', 'terlewat', '2024-02-28', 'Minum sebelum tidur - lupa diminum'),
(3, '19:00:00', 'belum', '2024-03-01', 'Minum sebelum tidur');

-- Insert reminders for Uswatun's medications
INSERT INTO `reminders` (`medication_id`, `waktu_pengingat`, `status_diminum`, `tanggal_diminum`, `keterangan`) VALUES
(4, '07:00:00', 'sudah', '2024-03-01', 'Minum setelah sarapan'),
(4, '13:00:00', 'sudah', '2024-03-01', 'Minum setelah makan siang'),
(5, '10:00:00', 'belum', '2024-03-01', 'Gosokkan pada dada');

-- ============================================
-- CREATE INDEXES FOR OPTIMIZATION
-- ============================================
CREATE INDEX `idx_consultation_status` ON `consultations`(`status_darurat`, `tanggal_konsultasi`);
CREATE INDEX `idx_medication_user_date` ON `medications`(`user_id`, `created_at`);
CREATE INDEX `idx_reminder_status_date` ON `reminders`(`status_diminum`, `tanggal_diminum`);

-- ============================================
-- DATABASE VIEWS (Optional - untuk laporan)
-- ============================================

-- View untuk melihat konsultasi terbaru per user
CREATE VIEW `v_latest_consultations` AS
SELECT 
    u.id as user_id,
    u.nama_lengkap,
    u.email,
    c.id as consultation_id,
    c.keluhan,
    c.status_darurat,
    c.tanggal_konsultasi
FROM users u
LEFT JOIN consultations c ON u.id = c.user_id
WHERE c.tanggal_konsultasi = (
    SELECT MAX(c2.tanggal_konsultasi) 
    FROM consultations c2 
    WHERE c2.user_id = u.id
)
OR c.id IS NULL;

-- View untuk melihat status pengingat obat hari ini
CREATE VIEW `v_today_reminders` AS
SELECT 
    m.id as medication_id,
    u.id as user_id,
    u.nama_lengkap,
    m.nama_obat,
    m.dosis,
    r.id as reminder_id,
    r.waktu_pengingat,
    r.status_diminum,
    r.keterangan
FROM reminders r
JOIN medications m ON r.medication_id = m.id
JOIN users u ON m.user_id = u.id
WHERE r.tanggal_diminum = CURDATE()
ORDER BY r.waktu_pengingat ASC;

-- ============================================
-- SAMPLE QUERIES (untuk testing)
-- ============================================

-- Lihat semua user
-- SELECT * FROM users;

-- Lihat semua konsultasi dari Shabrina
-- SELECT * FROM consultations WHERE user_id = 1;

-- Lihat obat-obatan dan pengingat
-- SELECT m.*, r.* FROM medications m 
-- LEFT JOIN reminders r ON m.id = r.medication_id 
-- WHERE m.user_id = 1;

-- Hitung total konsultasi per user
-- SELECT u.nama_lengkap, COUNT(c.id) as total_konsultasi 
-- FROM users u 
-- LEFT JOIN consultations c ON u.id = c.user_id 
-- GROUP BY u.id;

-- ============================================
-- END OF DATABASE SCHEMA
-- ============================================
