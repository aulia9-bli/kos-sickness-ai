# Quick Reference - Vercel Serverless Functions

## 🚀 Quick Commands

```bash
# Setup
npm install
cp .env.example .env.local

# Development
vercel dev                          # Run locally with Vercel
cd frontend && npm run dev          # Or just frontend dev

# Deployment
git push origin main               # Auto-deploys to Vercel

# Testing
npm run test:api                   # Linux/Mac
npm run test:api:win               # Windows
```

## 📍 API Endpoints (After Deploy)

```
Production: https://your-project.vercel.app/api/*
Local Dev:  http://localhost:3000/api/*
```

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api` | Root endpoint |
| GET | `/api/health` | Health check |
| GET | `/api/app-info` | App information |
| POST | `/api/analyze-sickness` | Analyze complaint |
| POST | `/api/chat` | Chat interface |

## 🔧 Environment Setup

**`.env.local` (Required for local development)**
```env
GROQ_API_KEY=sk_xxxxxx
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

**Vercel Dashboard (For production)**
1. Settings → Environment Variables
2. Add `GROQ_API_KEY`
3. Save and redeploy

## 📂 File Structure

```
api/                           # Vercel Functions
├── index.js                  # GET /
├── health.js                 # GET /api/health
├── app-info.js               # GET /api/app-info
├── analyze-sickness.js       # POST /api/analyze-sickness
└── chat.js                   # POST /api/chat

frontend/                      # React Frontend
├── src/
│   ├── components/
│   ├── services/
│   │   └── apiClient.js      # Uses /api/analyze-sickness
│   └── ...
└── ...
```

## 🔌 Using API from Frontend

```javascript
// services/apiClient.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Use it
export const analyzeSickness = async (complaint) => {
  const response = await apiClient.post('/api/analyze-sickness', {
    complaint,
  });
  return response.data;
};
```

## ✅ Health Check

Test if API is working:

```bash
# Local development
curl http://localhost:3000/api/health

# After deployed to Vercel
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server berjalan dengan baik ✅",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧪 Test Sickness Analysis

```bash
# Create complaint
curl -X POST http://localhost:3000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{"complaint":"Sakit kepala dan demam"}'

# Response
{
  "success": true,
  "data": {
    "complaint": "Sakit kepala dan demam",
    "advice": "...",
    "timestamp": "2024-01-15T10:30:00Z",
    "model": "llama-3.1-8b-instant"
  }
}
```

## ⚠️ Common Issues

### Issue: API returns 404
**Solution**: Check vercel.json routing config, ensure functions are in `/api/` folder

### Issue: CORS error in browser
**Solution**: Check `.env.local` has correct `CORS_ORIGIN`, Vercel env vars set

### Issue: Groq API error
**Solution**: Verify `GROQ_API_KEY` is set correctly, check API key at https://console.groq.com

### Issue: Request timeout
**Solution**: First call may take longer (cold start), normal behavior

## 📚 Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Groq Console**: https://console.groq.com
- **API Client (Frontend)**: `frontend/src/services/apiClient.js`
- **Full Docs**: `SERVERLESS_ARCHITECTURE.md`

## 🔄 Deployment Workflow

```
1. Code changes
   ↓
2. git push origin main
   ↓
3. GitHub webhook triggers Vercel
   ↓
4. Vercel builds & deploys
   ↓
5. API live at vercel-project.app
```

## 🎯 Next Steps

1. ✅ Setup `.env.local` with GROQ_API_KEY
2. ✅ Run `vercel dev` for local testing
3. ✅ Test endpoints with curl or Postman
4. ✅ Deploy: `git push origin main`
5. ✅ Monitor in Vercel Dashboard

---

**Last Updated**: 2024-01-15
**Architecture**: Vercel Serverless Functions
**Status**: Ready for Production
