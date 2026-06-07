# Panduan Deployment ke Vercel - Kos-Sickness API

## 📌 Prasyarat

- [x] Git repository initialized
- [x] GitHub account (untuk connect dengan Vercel)
- [x] Vercel account
- [x] GROQ_API_KEY (dari https://console.groq.com)

---

## 🚀 Quick Start Deployment

### 1. Connect Repository ke Vercel

```bash
# Option A: Gunakan Vercel CLI
npm install -g vercel
vercel login
vercel

# Option B: Manual via https://vercel.com/new
# - Select your GitHub repository
# - Configure project settings
```

### 2. Set Environment Variables di Vercel

Di Vercel Dashboard → Settings → Environment Variables:

```
GROQ_API_KEY          = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV              = production
CORS_ORIGIN           = auto  (or https://your-domain.vercel.app)
```

### 3. Deploy

```bash
# Automatic deployment on git push
# Atau manual:
vercel --prod
```

---

## ⚙️ Vercel Configuration Breakdown

### vercel.json - Structure

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "builds": [
    {
      "src": "frontend/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ]
}
```

**Penjelasan:**
- `version: 2` - Vercel Functions v2 (latest)
- `buildCommand` - Dijalankan sebelum functions di-bundle
- `builds` - Define build output untuk static dan serverless

### Routes - URL Mapping

```json
{
  "routes": [
    {
      "src": "/api/health",
      "dest": "/api/health.js",
      "methods": ["GET", "OPTIONS"]
    },
    {
      "src": "/api/chat",
      "dest": "/api/chat.js",
      "methods": ["POST", "OPTIONS"]
    },
    {
      "src": "/(.*\\.(?:js|css|svg|...))",
      "dest": "/frontend/dist/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/index.html"
    }
  ]
}
```

**Order Matters!**
- Vercel mengevaluasi routes dari atas ke bawah
- Endpoint spesifik harus sebelum generic routes
- Static files harus sebelum fallback to index.html

### Headers - Caching Strategy

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        }
      ]
    },
    {
      "source": "/frontend/dist/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Cache Explanation:**
- **API Endpoints**: `no-cache` - Setiap request hit server (data real-time)
- **Static Assets**: `max-age=31536000` - Cache 1 tahun (file names hashed)

### envs - Environment Overrides

```json
{
  "env": {
    "NODE_ENV": "production",
    "CORS_ORIGIN": "@CORS_ORIGIN"  // placeholder
  },
  "envs": {
    "preview": {
      "CORS_ORIGIN": "auto"  // Allow any origin di preview
    },
    "production": {
      "CORS_ORIGIN": "https://kos-sickness.vercel.app"  // Locked di prod
    }
  }
}
```

---

## 🔧 Function Configuration

### Package.json Requirements

```json
{
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "groq-sdk": "^0.x.x"
  }
}
```

**Important:**
- `type: module` - Enable ES6 modules (required untuk import/export)
- `node: >=18.0.0` - Vercel supports Node 18, 20, 22

### API Function Signature

```javascript
// ✅ CORRECT - Vercel handler
export default async function handler(req, res) {
  // req: http.IncomingMessage
  // res: http.ServerResponse
  
  res.status(200).json({ success: true });
}

// ❌ WRONG - Express style
app.get('/api/health', (req, res) => {
  res.json({ success: true });
});
```

---

## 📊 Performance Optimization

### 1. Function Bundling

Vercel automatically bundles minimal dependencies:
- Only dependencies used di function
- Tree-shaking untuk unused code
- Reduces cold start time

### 2. Cold Start Optimization

```javascript
// ❌ SLOW - Client initialization di setiap request
export default async function handler(req, res) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  // ... use groq
}

// ✅ FAST - Reuse cached client
let groqClient = null;

export const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

export default async function handler(req, res) {
  const groq = getGroqClient();
  // ... use groq
}
```

### 3. Response Time Management

```javascript
// Set timeout untuk Groq API calls
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 detik

try {
  const response = await groqClient.chat.completions.create({
    // ... config
  });
  clearTimeout(timeoutId);
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    return res.status(408).json({ error: 'Timeout' });
  }
}
```

---

## 🐛 Debugging & Monitoring

### 1. Check Logs

```bash
# Via Vercel CLI
vercel logs <deployment-id>

# Via Dashboard
# → Deployments → Select deployment → Logs
```

### 2. Monitor Function Execution

Dashboard → Functions:
- **Invocations**: Total calls
- **Duration**: Average execution time
- **Memory**: Peak memory usage
- **Errors**: Error count dan stack traces

### 3. Real-time Logs

```bash
vercel logs --follow
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module"

**Cause**: Dependency not listed di package.json

```bash
npm install groq-sdk
```

### Issue 2: "GROQ_API_KEY undefined"

**Solution**: Add di Vercel Settings → Environment Variables

### Issue 3: "CORS error"

**Check**:
1. Request origin is dalam `ALLOWED_ORIGINS`
2. CORS headers di vercel.json
3. OPTIONS method di allowed routes

```javascript
// Verify via curl
curl -v -H "Origin: http://localhost:3000" \
  https://your-app.vercel.app/api/health
```

### Issue 4: "502 Bad Gateway"

**Causes**:
- Unhandled exception di function
- Timeout (default 10 sec, max 60 sec)
- Memory exceeded

**Debug**:
```bash
vercel logs --follow
# Look untuk stack traces dan error messages
```

### Issue 5: "Cold Start Slow"

**Solutions**:
1. Reduce bundle size - Remove unused dependencies
2. Use cached clients - Reuse connections
3. Move static logic - Precompute outside handler
4. Monitor size - Check dashboard for warnings

---

## 🔐 Security Checklist

- [x] Environment variables tidak di-commit
- [x] API Keys stored di Vercel Settings (not .env.local)
- [x] CORS origin restricted di production
- [x] Input validation pada semua endpoints
- [x] Error messages tidak expose sensitive data
- [x] Rate limiting (via Groq API)
- [x] HTTPS enforced (Vercel default)

---

## 📈 Scaling & Limits

### Default Limits
- **Execution Time**: 10 seconds (default), 60 seconds (max)
- **Memory**: 1024 MB
- **Request Size**: 6 MB
- **Response Size**: 6 MB

### Groq API Limits
- **Rate Limit**: Depends on plan
- **Max Tokens**: 32768 (Mixtral)
- **Timeout**: Handle dengan AbortController

---

## 🔄 CI/CD Workflow

### Automatic Deployment

Vercel automatically deploys on:
1. Push to main → Production
2. Push to other branches → Preview

### Preview Deployments

```bash
# Create branch
git checkout -b feature/new-endpoint

# Make changes
git commit -m "Add new endpoint"
git push origin feature/new-endpoint

# Vercel auto-creates preview URL
# Share URL untuk testing
```

### Production Deployment

```bash
# Merge ke main
git checkout main
git merge feature/new-endpoint
git push origin main

# Vercel auto-deploys
# Monitor di dashboard
```

---

## 📚 Useful Commands

```bash
# Login ke Vercel
vercel login

# Deploy ke preview
vercel

# Deploy ke production
vercel --prod

# Check status
vercel list

# View logs
vercel logs <deployment-id>

# Local testing (emulate Vercel)
vercel dev

# Link existing project
vercel link
```

---

## 🎯 Monitoring & Alerts

Di Vercel Dashboard:
1. Go to Settings → Integrations
2. Add monitoring tools:
   - **Datadog** - Advanced monitoring
   - **New Relic** - APM metrics
   - **Sentry** - Error tracking

### Example Sentry Integration

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

export default async function handler(req, res) {
  try {
    // ... your code
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

---

## 📖 Next Steps

1. Deploy ke Vercel preview
2. Test semua endpoints
3. Monitor logs dan performance
4. Set up alerts
5. Plan scaling strategy
6. Document API endpoints
7. Update README dengan deployed URL

---

**Last Updated:** 2024  
**Version:** 2.0.0 - Refactored Vercel Configuration
