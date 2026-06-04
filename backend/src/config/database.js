/**
 * MySQL Database Configuration
 * File: backend/src/config/database.js
 * 
 * Konfigurasi koneksi database untuk aplikasi Kos-Sickness
 * Gunakan dengan mysql2/promise untuk async operations
 */

const mysql = require('mysql2/promise');

// Konfigurasi Pool koneksi
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // kosong untuk default XAMPP
  database: process.env.DB_NAME || 'kos_sickness_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+07:00' // Indonesia timezone
});

// Test koneksi saat aplikasi start
pool.getConnection().then(connection => {
  console.log('✅ Database Connected Successfully');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'kos_sickness_db'}`);
  connection.release();
}).catch(error => {
  console.error('❌ Database Connection Error:', error);
  process.exit(1);
});

module.exports = pool;
