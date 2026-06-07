# Refactor Konfigurasi Vercel - Serverless Functions Native

## 📋 Ringkasan Perubahan

Refactor ini mengoptimalkan project untuk kompatibilitas penuh dengan Vercel Serverless Functions native dengan fokus pada:
- ✅ Modularisasi utilities reusable
- ✅ Eliminasi duplikasi kode CORS
- ✅ Improved error handling dan logging
- ✅ Optimasi vercel.json configuration
- ✅ Better request/response handling

---

## 🏗️ Struktur Folder Baru

```
api/
├── index.js                 # Root API endpoint
├── health.js               # Health check endpoint
├── app-info.js             # Application info endpoint
├── analyze-sickness.js     # Sickness analysis endpoint (refactored)
├── chat.js                 # Chat conversation endpoint (refactored)
└── utils/
    ├── cors.js             # CORS middleware utilities ✨ NEW
    ├── validators.js       # Input validation utilities ✨ NEW
    ├── logger.js           # Logging utilities ✨ NEW
    └── groq.js             # Groq API configuration ✨ NEW
```

---

## 🔄 Key Changes by File

### 1. **vercel.json** - Native Serverless Configuration

**Improvements:**
- ✅ Separated `buildCommand` from `builds` array
- ✅ Explicit route definitions untuk setiap endpoint
- ✅ Added `headers` configuration untuk caching strategy:
  - API endpoints: `no-cache` (dynamic responses)
  - Static assets: `max-age=31536000, immutable`
- ✅ Added `envs` untuk environment-specific configuration
- ✅ Better assets serving untuk static files
- ✅ Added `trailingSlash: false` untuk URL consistency

**Before:**
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.js" },
    { "src": "/(.*)", "dest": "/frontend/dist/index.html" }
  ]
}
```

**After:**
```json
{
  "routes": [
    { "src": "/api/health", "dest": "/api/health.js" },
    { "src": "/api/app-info", "dest": "/api/app-info.js" },
    // ... explicit routes for each endpoint
    { "src": "/(.*\\.(js|css|...))", "dest": "/frontend/dist/$1" },
    { "src": "/(.*)", "dest": "/frontend/dist/index.html" }
  ],
  "headers": [
    // Cache policies for API and static assets
  ]
}
```

---

### 2. **api/utils/cors.js** - CORS Middleware (NEW)

**Utilities:**
- `setCorsHeaders(res, origin)` - Set CORS headers dengan origin validation
- `handleCorsPreFlight(req, res)` - Handle OPTIONS preflight requests
- `withCors(handler, allowedMethods)` - Wrapper untuk automatic CORS handling
- `errorResponse(res, statusCode, message, data)` - Consistent error responses
- `successResponse(res, data, statusCode)` - Consistent success responses

**Usage:**
```javascript
import { withCors, successResponse } from './utils/cors.js';

const handler = (req, res) => {
  successResponse(res, { data: 'hello' });
};

export default withCors(handler, ['GET', 'POST']);
```

**Benefits:**
- ✅ Single source of truth untuk CORS logic
- ✅ Eliminates ~50 lines of duplicate code per endpoint
- ✅ Consistent error/success response format
- ✅ Automatic preflight handling

---

### 3. **api/utils/validators.js** - Input Validation (NEW)

**Utilities:**
- `validateJsonBody(req)` - Parse dan validate JSON request body
- `validateRequiredFields(data, fields)` - Validate required fields
- `validateComplaint(complaint)` - Specific validation untuk health complaints
- `validateEnvVariables(envs)` - Validate required environment variables

**Features:**
- ✅ Consistent validation error responses
- ✅ Detailed error information (missing fields, length constraints)
- ✅ Type checking
- ✅ Length constraints (min/max)

---

### 4. **api/utils/logger.js** - Structured Logging (NEW)

**Utilities:**
- `log(level, message, data)` - Leveled logging dengan colors
- `logRequest(req, endpoint)` - Log incoming requests
- `logResponse(statusCode, message, endpoint, duration)` - Log responses
- `logError(message, error, endpoint)` - Log detailed errors
- `safeLog(obj)` - Redact sensitive data sebelum logging

**Log Levels:**
- `DEBUG` - Development information
- `INFO` - General information (requests, responses)
- `WARN` - Warning messages
- `ERROR` - Error messages

**Features:**
- ✅ Color-coded terminal output
- ✅ Request duration tracking
- ✅ Sensitive data redaction (passwords, tokens, API keys)
- ✅ Development vs Production awareness

---

### 5. **api/utils/groq.js** - Groq API Configuration (NEW)

**Utilities:**
- `initializeGroqClient()` - Initialize dengan error handling
- `getGroqClient()` - Get cached instance
- `createGroqMessages(message, systemPrompt, history)` - Prepare messages
- `validateGroqResponse(response)` - Validate API response
- `handleGroqError(error)` - Handle dan map error codes

**Constants:**
- `GroqModels.MIXTRAL` - Recommended model (32K tokens)
- `SYSTEM_PROMPTS` - Pre-defined system prompts untuk different use cases
- `DEFAULT_CHAT_PARAMS` - Optimized default parameters

**Error Handling:**
- ✅ Maps status codes ke user-friendly messages
- ✅ Distinguishes retryable vs permanent errors
- ✅ Handles rate limiting, authentication, timeouts

---

## ♻️ Refactored Endpoints

### **health.js** - Health Check
```javascript
// Before: 30 lines with duplicate CORS
// After: 25 lines, using withCors wrapper
import { withCors, successResponse } from './utils/cors.js';

const handler = (req, res) => {
  successResponse(res, { status: 'healthy' });
};

export default withCors(handler, ['GET']);
```

### **analyze-sickness.js** - Sickness Analysis
```javascript
// Before: 200+ lines with mixed concerns
// After: 120 lines, separated concerns
import { withCors } from './utils/cors.js';
import { validateComplaint } from './utils/validators.js';
import { getGroqClient, handleGroqError } from './utils/groq.js';
import { logRequest, logResponse } from './utils/logger.js';

const handler = async (req, res) => {
  logRequest(req, 'analyze-sickness');
  
  const { complaint } = req.body;
  const validation = validateComplaint(complaint);
  
  if (!validation.valid) {
    return errorResponse(res, validation.status, validation.message);
  }
  
  // ... process with Groq
};

export default withCors(handler, ['POST']);
```

### **chat.js** - Multi-turn Conversation
```javascript
// Now supports:
// - Conversation history
// - Conversation IDs
// - Better error handling
// - Improved logging

const handler = async (req, res) => {
  const { message, conversationId, history } = req.body;
  
  // Prepare messages with conversation history
  const messages = [];
  if (history) {
    messages.push(...history.slice(-10)); // Keep last 10 messages
  }
  messages.push({ role: 'user', content: message });
  
  // ... call Groq with full conversation context
};
```

---

## 🚀 Best Practices Implemented

### 1. **Handler Pattern**
```javascript
// ✅ RECOMMENDED
import { withCors } from './utils/cors.js';

const handler = (req, res) => {
  // Your business logic
};

export default withCors(handler, ['GET', 'POST']);
```

### 2. **Error Handling**
```javascript
// ✅ Consistent error format
try {
  // ... operation
} catch (error) {
  logError(message, error, endpoint);
  errorResponse(res, 500, 'User-friendly message');
}
```

### 3. **Request Validation**
```javascript
// ✅ Validate early
const validation = validateComplaint(complaint);
if (!validation.valid) {
  return errorResponse(res, validation.status, validation.message);
}
```

### 4. **Logging**
```javascript
// ✅ Log lifecycle
logRequest(req, 'endpoint-name');
// ... processing
logResponse(200, 'Success', 'endpoint-name', duration);
```

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Code Duplication** | CORS repeated in each endpoint | Single source of truth |
| **Error Handling** | Inconsistent per endpoint | Unified error handling |
| **Logging** | console.log scattered | Structured logging with levels |
| **CORS Headers** | 250+ lines total | 50 lines in utils |
| **Response Format** | Inconsistent | Consistent via helpers |
| **Groq Integration** | Duplicated per endpoint | Centralized configuration |
| **Environment Validation** | Per endpoint | Centralized utils |
| **Total API Code** | ~800 lines | ~400 lines |

---

## 🔒 Security Improvements

### 1. **Sensitive Data Redaction**
```javascript
// Password, token, apiKey akan di-redact otomatis
const logData = safeLog(userData);
```

### 2. **Origin Validation**
```javascript
// CORS origin di-validate terhadap whitelist
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://kos-sickness.vercel.app',
];
```

### 3. **Input Validation**
```javascript
// Length constraints, type checking
validateComplaint(complaint);
// - Checks length (5-2000 chars)
// - Checks type (must be string)
// - Trims whitespace
```

### 4. **Error Messages**
```javascript
// Sensitive errors tidak exposed di production
if (process.env.NODE_ENV !== 'development') {
  delete errorData.stack;
  delete errorData.apiKeyError;
}
```

---

## 🧪 Testing Changes

### Test Endpoints

**Health Check:**
```bash
curl -X GET http://localhost:3000/api/health
```

**App Info:**
```bash
curl -X GET http://localhost:3000/api/app-info
```

**Analyze Sickness (POST):**
```bash
curl -X POST http://localhost:3000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya pusing dan demam 38°C"}'
```

**Chat Conversation:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Apa itu demam berdarah?", "conversationId": "conv_123"}'
```

---

## 📝 Migration Checklist

- [x] Create `api/utils/` directory structure
- [x] Refactor `health.js` to use `withCors`
- [x] Refactor `app-info.js` dengan improved documentation
- [x] Refactor `analyze-sickness.js` dengan validators dan logger
- [x] Refactor `chat.js` dengan conversation support
- [x] Optimize `vercel.json` dengan proper routing dan caching
- [x] Add CORS utility functions
- [x] Add validation utilities
- [x] Add logger utilities
- [x] Add Groq configuration utilities
- [ ] Update frontend `apiClient.js` jika diperlukan
- [ ] Test semua endpoints di local
- [ ] Test di Vercel preview environment
- [ ] Monitor logs di Vercel dashboard

---

## 🔗 Environment Variables

Pastikan variables ini tersedia di Vercel Settings:

```
GROQ_API_KEY         # Groq API Key (REQUIRED)
NODE_ENV             # production (atau development)
CORS_ORIGIN          # auto / specific domain
```

---

## 📚 Additional Resources

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Groq API Documentation](https://console.groq.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Created:** 2024  
**Version:** 2.0.0 - Refactored with Native Vercel Serverless Support
