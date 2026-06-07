# Kos-Sickness API Reference

## Base URL

```
https://kos-sickness.vercel.app/api
```

Untuk local development:
```
http://localhost:3000/api
```

---

## 📋 Endpoints Overview

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/health` | GET | Health check | ❌ |
| `/app-info` | GET | Application information | ❌ |
| `/analyze-sickness` | POST | Analyze symptoms | ❌ |
| `/chat` | POST | Multi-turn conversation | ❌ |

---

## 🏥 Health Check

**GET** `/api/health`

**Purpose**: Verify API is running and healthy

**Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Server berjalan dengan baik ✅",
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:45.123Z",
  "environment": "production",
  "uptime": 3600.5
}
```

**Error** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Terjadi kesalahan dalam mengambil status kesehatan server",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**Example:**
```bash
# cURL
curl -X GET https://kos-sickness.vercel.app/api/health

# JavaScript
fetch('https://kos-sickness.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log(data))

# Python
import requests
response = requests.get('https://kos-sickness.vercel.app/api/health')
print(response.json())
```

---

## ℹ️ Application Info

**GET** `/api/app-info`

**Purpose**: Get detailed information about the application, endpoints, and capabilities

**Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "app": {
    "name": "Kos-Sickness API",
    "version": "2.0.0",
    "description": "Konsultasi kesehatan AI untuk mahasiswa kos menggunakan Groq LLM",
    "author": "Kos-Sickness Team",
    "license": "MIT",
    "repository": "https://github.com/your-username/kos-sickness"
  },
  "server": {
    "status": "running",
    "environment": "production",
    "platform": "Vercel",
    "uptime": 3600.5
  },
  "ai": {
    "provider": "Groq",
    "model": "mixtral-8x7b-32768",
    "status": "ready"
  },
  "endpoints": {
    "health": {
      "method": "GET",
      "path": "/api/health",
      "description": "Health check endpoint"
    },
    "appInfo": {
      "method": "GET",
      "path": "/api/app-info",
      "description": "Application information"
    },
    "analyzeSickness": {
      "method": "POST",
      "path": "/api/analyze-sickness",
      "description": "Analyze sickness symptoms",
      "body": {
        "complaint": "string (required) - Description of symptoms"
      }
    },
    "chat": {
      "method": "POST",
      "path": "/api/chat",
      "description": "Chat with AI assistant",
      "body": {
        "message": "string (required) - User message",
        "conversationId": "string (optional) - For conversation history"
      }
    }
  },
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**Example:**
```bash
curl -X GET https://kos-sickness.vercel.app/api/app-info
```

---

## 🩺 Analyze Sickness

**POST** `/api/analyze-sickness`

**Purpose**: Analyze health symptoms and provide first-aid advice using AI

### Request

**Body** (application/json):
```json
{
  "complaint": "Saya pusing dan demam 38°C sejak kemarin"
}
```

**Field Details:**
- `complaint` (string, required)
  - Length: 5-2000 characters
  - Description: Detailed description of symptoms

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "complaint": "Saya pusing dan demam 38°C sejak kemarin",
    "advice": "Berdasarkan gejala yang Anda laporkan (pusing dan demam 38°C), ini bisa merupakan tanda flu, infeksi virus, atau penyakit demam lainnya...\n\n**Langkah Pertolongan Pertama:**\n1. Istirahat cukup - Tidur minimal 8 jam\n2. Minum air putih - Minimal 2-3 liter per hari\n3. Kompres dingin - Tempelkan handuk dingin di dahi\n4. Konsumsi paracetamol - 500mg setiap 4-6 jam (max 2g/hari)\n5. Hindari makanan berat - Pilih makanan lunak dan mudah dicerna\n\n**Tanda Bahaya - Segera ke Dokter jika:**\n- Demam tidak turun setelah 3 hari\n- Pusing sangat parah atau penurunan kesadaran\n- Kesulitan bernapas\n- Muntah terus-menerus\n- Ruam muncul di seluruh tubuh",
    "model": "mixtral-8x7b-32768",
    "processingTimeMs": 1234
  },
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Error Responses

**400 Bad Request** - Missing or invalid complaint:
```json
{
  "success": false,
  "message": "Field \"complaint\" diperlukan dalam request body",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**401 Unauthorized** - GROQ_API_KEY not configured:
```json
{
  "success": false,
  "message": "GROQ_API_KEY tidak dikonfigurasi. Hubungi administrator.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**408 Request Timeout** - Groq API timeout:
```json
{
  "success": false,
  "message": "Request timeout. Groq API sedang tidak responsif. Silakan coba lagi.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**429 Too Many Requests**:
```json
{
  "success": false,
  "message": "Terlalu banyak request. Silakan tunggu beberapa saat sebelum mencoba lagi.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Examples

**cURL:**
```bash
curl -X POST https://kos-sickness.vercel.app/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "Saya pusing dan demam 38°C sejak kemarin"
  }'
```

**JavaScript (Fetch):**
```javascript
const response = await fetch('https://kos-sickness.vercel.app/api/analyze-sickness', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    complaint: 'Saya pusing dan demam 38°C sejak kemarin'
  })
});

const data = await response.json();
console.log(data.data.advice);
```

**JavaScript (Axios):**
```javascript
import axios from 'axios';

const response = await axios.post(
  'https://kos-sickness.vercel.app/api/analyze-sickness',
  { complaint: 'Saya pusing dan demam 38°C sejak kemarin' }
);

console.log(response.data.data.advice);
```

**Python:**
```python
import requests

response = requests.post(
  'https://kos-sickness.vercel.app/api/analyze-sickness',
  json={'complaint': 'Saya pusing dan demam 38°C sejak kemarin'}
)

advice = response.json()['data']['advice']
print(advice)
```

---

## 💬 Chat Conversation

**POST** `/api/chat`

**Purpose**: Multi-turn conversation with AI health assistant with conversation history support

### Request

**Body** (application/json):
```json
{
  "message": "Apa itu demam berdarah?",
  "conversationId": "conv_1234567890",
  "history": [
    {
      "role": "user",
      "content": "Saya demam 40°C"
    },
    {
      "role": "assistant",
      "content": "Demam 40°C adalah demam tinggi yang memerlukan perhatian..."
    }
  ]
}
```

**Field Details:**
- `message` (string, required)
  - Length: 1-2000 characters
  - Description: User's message or question

- `conversationId` (string, optional)
  - Format: Unique identifier for conversation tracking
  - Purpose: Group related messages together

- `history` (array, optional)
  - Format: Array of previous messages with role and content
  - Limit: Last 10 messages kept for context
  - Roles: "user" | "assistant"

### Success Response (200 OK)

```json
{
  "success": true,
  "conversationId": "conv_1234567890",
  "response": "Demam berdarah adalah penyakit yang disebabkan oleh virus dengue yang ditularkan melalui gigitan nyamuk Aedes aegypti...\n\nGejala demam berdarah...\n\nTanda bahaya yang memerlukan penanganan medis segera...",
  "message": "Apa itu demam berdarah?",
  "model": "mixtral-8x7b-32768",
  "processingTimeMs": 1234,
  "historyLength": 3,
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Error Responses

**400 Bad Request** - Missing message:
```json
{
  "success": false,
  "message": "Field \"message\" diperlukan dalam request body",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**429 Too Many Requests**:
```json
{
  "success": false,
  "message": "Terlalu banyak request. Silakan tunggu beberapa saat sebelum mencoba lagi.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat memproses pesan. Silakan coba lagi.",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Examples

**Single Message (No History):**
```bash
curl -X POST https://kos-sickness.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Apa saja gejala COVID-19?"
  }'
```

**With Conversation History:**
```bash
curl -X POST https://kos-sickness.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Berapa lama biasanya demam?",
    "conversationId": "conv_123",
    "history": [
      {
        "role": "user",
        "content": "Saya demam tinggi"
      },
      {
        "role": "assistant",
        "content": "Demam tinggi bisa disebabkan oleh berbagai hal..."
      }
    ]
  }'
```

**JavaScript - Full Conversation Flow:**
```javascript
class ChatClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.conversationId = `conv_${Date.now()}`;
    this.history = [];
  }

  async sendMessage(message) {
    const response = await fetch(`${this.apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationId: this.conversationId,
        history: this.history
      })
    });

    const data = await response.json();

    // Update history
    this.history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.response }
    );

    return data.response;
  }
}

// Usage
const chat = new ChatClient('https://kos-sickness.vercel.app');

const response1 = await chat.sendMessage('Saya demam 40°C');
console.log(response1);

const response2 = await chat.sendMessage('Apa yang harus saya lakukan?');
console.log(response2);
```

---

## 🔄 Response Format Standard

Semua endpoint mengikuti format response yang konsisten:

**Success:**
```json
{
  "success": true,
  "data": { /* specific data */ },
  "timestamp": "ISO-8601 timestamp"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": { /* optional error details */ },
  "timestamp": "ISO-8601 timestamp"
}
```

---

## 🔐 Headers & CORS

### Allowed Methods
- GET
- POST
- OPTIONS (automatic preflight handling)

### Required Headers
```
Content-Type: application/json  (untuk POST requests)
```

### CORS Headers (Automatic)
```
Access-Control-Allow-Origin: * (atau specific domain)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## ⚡ Rate Limiting

### Limits
- **Groq API**: Depends on your plan
- **Vercel Functions**: 10 seconds execution timeout (default)
- **Request Size**: Max 6 MB

### Handling Rate Limit

Jika mendapat 429 (Too Many Requests):
```javascript
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function requestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      console.log(`Rate limited. Retrying after ${delay}ms...`);
      await sleep(delay);
      continue;
    }
    
    return response;
  }
}
```

---

## 📊 Performance Metrics

### Typical Response Times
- Health Check: ~50ms
- App Info: ~100ms
- Analyze Sickness: 2-5 seconds (Groq API)
- Chat: 1-3 seconds (Groq API)

### Optimizations
- Function response cached when possible
- Groq client reused across requests
- Minimal dependencies bundled
- Static assets cached (1 year)

---

## 🐛 Debugging

### Check API Status
```bash
curl -v https://kos-sickness.vercel.app/api/health
```

### Check CORS
```bash
curl -v -H "Origin: http://localhost:3000" \
  https://kos-sickness.vercel.app/api/health
```

### Enable Verbose Logging
```javascript
// Add to frontend before API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Call:', args[0], args[1]);
  return originalFetch.apply(this, args)
    .then(res => {
      console.log('API Response:', res.status, res.statusText);
      return res;
    });
};
```

---

## 📝 Changelog

### v2.0.0 (Current)
- ✅ Refactored Vercel configuration
- ✅ Added utility modules (cors, validators, logger, groq)
- ✅ Improved error handling
- ✅ Multi-turn conversation support
- ✅ Structured logging

### v1.0.0
- Initial release
- Basic health, app-info, analyze-sickness endpoints

---

**Last Updated:** 2024  
**Version:** 2.0.0
