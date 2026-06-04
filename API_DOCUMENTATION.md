# 📚 API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://your-production-url.com
```

---

## 📋 Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Description:** Mengecek status server dan API

**Response:**
```json
{
  "success": true,
  "message": "Server berjalan dengan baik ✅",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 125.45
}
```

**Status Code:** `200 OK`

---

### 2. Get App Info

**Endpoint:** `GET /api/app-info`

**Description:** Mendapatkan informasi aplikasi dan status AI model

**Response:**
```json
{
  "success": true,
  "app": {
    "name": "Kos-Sickness",
    "version": "1.0.0",
    "description": "Konsultasi kesehatan AI untuk mahasiswa kos"
  },
  "server": {
    "status": "running",
    "environment": "development",
    "port": 5000
  },
  "ai": {
    "provider": "Groq",
    "model": "llama-3.1-8b-instant",
    "status": "ready"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Code:** `200 OK`

---

### 3. Analyze Sickness

**Endpoint:** `POST /api/analyze-sickness`

**Description:** Menganalisis gejala kesehatan dan memberikan saran pertolongan pertama

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "complaint": "Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin"
}
```

**Query Parameters:** None

**Path Parameters:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaint": "Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin",
    "advice": "Berdasarkan gejala yang Anda alami, ini kemungkinan demam atau flu...",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "model": "llama-3.1-8b-instant"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Keluhan harus minimal 5 karakter",
  "minimumLength": 5,
  "currentLength": 3
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "API Key tidak valid. Silakan periksa konfigurasi GROQ_API_KEY di file .env"
}
```

**Response (Error - 429):**
```json
{
  "success": false,
  "message": "Terlalu banyak request. Silakan tunggu beberapa saat sebelum mencoba lagi."
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat memproses permintaan. Silakan coba lagi."
}
```

---

## 🔍 Request & Response Details

### Input Validation

**Field:** `complaint`
- **Type:** `string` (required)
- **Min Length:** 5 characters
- **Max Length:** 2000 characters
- **Format:** Plain text, no HTML/JavaScript

**Validation Rules:**
- Tidak boleh kosong atau hanya spasi
- Minimal 5 karakter
- Maksimal 2000 karakter
- Tidak boleh mengandung tag HTML atau JavaScript

### Response Fields

**Success Response:**
- `success` (boolean): Menunjukkan request berhasil
- `data` (object): Data hasil analisis
  - `complaint` (string): Keluhan yang dianalisis
  - `advice` (string): Saran dari AI
  - `timestamp` (string): Waktu analisis (ISO 8601 format)
  - `model` (string): Model AI yang digunakan

**Error Response:**
- `success` (boolean): Selalu false
- `message` (string): Pesan error yang jelas
- `[additional fields]` (optional): Field tambahan sesuai error type

---

## 📊 Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request berhasil |
| 400 | Bad Request | Input tidak valid |
| 401 | Unauthorized | API Key tidak valid |
| 408 | Request Timeout | Request timeout (timeout 25s) |
| 429 | Too Many Requests | Rate limit tercapai |
| 500 | Server Error | Error server internal |

---

## 🔐 Authentication

API menggunakan API Key dari Groq yang disimpan di server-side (environment variable).

**Tidak diperlukan authentication header** karena API Key sudah aman di server.

---

## 💾 Rate Limiting

- **Default:** Unlimited (tergantung Groq API quota)
- **Timeout:** 25 detik per request
- **Max Payload:** 50 KB

---

## 📝 Example Requests

### cURL

```bash
# Health Check
curl -X GET http://localhost:5000/api/health

# App Info
curl -X GET http://localhost:5000/api/app-info

# Analyze Sickness
curl -X POST http://localhost:5000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya mengalami sakit kepala dan demam"}'
```

### JavaScript (Fetch API)

```javascript
// Analyze Sickness
fetch('http://localhost:5000/api/analyze-sickness', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    complaint: 'Saya mengalami sakit kepala dan demam'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

url = 'http://localhost:5000/api/analyze-sickness'
payload = {
    'complaint': 'Saya mengalami sakit kepala dan demam'
}
headers = {
    'Content-Type': 'application/json'
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)
```

### Axios (JavaScript)

```javascript
import axios from 'axios';

const analyzeSickness = async (complaint) => {
  try {
    const response = await axios.post('http://localhost:5000/api/analyze-sickness', {
      complaint: complaint
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

analyzeSickness('Saya mengalami sakit kepala');
```

---

## 🧪 Testing dengan Postman

1. Import `Kos-Sickness-API.postman_collection.json`
2. Set `api_url` environment variable ke `http://localhost:5000`
3. Run requests dari collection

---

## 🚨 Error Handling

Aplikasi selalu mengembalikan response dalam format:

```json
{
  "success": boolean,
  "message": "string",
  "data": "object or null",
  ...additional fields
}
```

**Client-side error handling:**

```javascript
const response = await fetch('/api/analyze-sickness', { ... });
const data = await response.json();

if (!data.success) {
  // Handle error
  console.error(data.message);
} else {
  // Handle success
  console.log(data.data.advice);
}
```

---

## 📊 Performance

- **Average Response Time:** 2-5 detik (tergantung Groq API)
- **Max Request Size:** 50 KB
- **Timeout:** 25 detik
- **Concurrent Requests:** Unlimited (server-side)

---

## 🔗 Related Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [llama-3.1-8b-instant Model Info](https://console.groq.com/docs/models)
- [Main README](./README.md)
- [QUICK START Guide](./QUICK_START.md)
- [Installation Guide](./INSTALLATION.md)

---

**Last Updated:** January 15, 2024
**Version:** 1.0.0
