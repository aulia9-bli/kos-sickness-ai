# Kos-Sickness - Developer Quick Reference

## 🚀 Quick Start Commands

### Development
```bash
# Install everything
npm install && cd frontend && npm install && cd ..

# Option 1: Frontend only (dev server)
npm run dev:frontend       # Runs on :5173

# Option 2: Full stack with Vercel (recommended)
npm run dev:api            # Runs on :3000

# Build for production
npm run build:frontend     # Builds to frontend/dist/

# Test API endpoints
npm run test:api           # Linux/Mac
npm run test:api:win       # Windows

# Lint frontend
npm run lint
```

### Deployment
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Automated deployment
bash scripts/deploy-prod.sh

# View logs
vercel logs

# Check environment variables
vercel env list
```

---

## 📁 File Quick Reference

### API Endpoints
```
api/health.js              # GET /api/health
api/app-info.js            # GET /api/app-info
api/analyze-sickness.js    # POST /api/analyze-sickness
api/chat.js                # POST /api/chat
api/index.js               # GET /api (fallback)
```

### Utilities
```
api/utils/cors.js          # CORS handling & response helpers
api/utils/validators.js    # Input validation
api/utils/logger.js        # Structured logging
api/utils/groq.js          # Groq API configuration
api/utils/index.js         # Barrel export
```

### Configuration
```
vercel.json                # Vercel configuration
.env.example               # Environment variables template
package.json               # Dependencies & scripts
```

### Frontend
```
frontend/src/App.jsx       # Main React component
frontend/src/services/     # API client
frontend/vite.config.js    # Vite configuration
frontend/tailwind.config.js# Tailwind CSS config
```

---

## 📝 API Usage Examples

### Health Check
```bash
curl http://localhost:3000/api/health
```

### App Info
```bash
curl http://localhost:3000/api/app-info
```

### Analyze Sickness
```bash
curl -X POST http://localhost:3000/api/analyze-sickness \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": "Saya demam 38°C dan pusing"
  }'
```

### Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Apa penyebab demam?",
    "conversationId": "conv_123",
    "history": []
  }'
```

---

## 🔧 Environment Variables

### Required
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### Optional
```env
CORS_ORIGIN=auto
NODE_ENV=production
VITE_API_URL=http://localhost:3000/api
```

### Set in Vercel Dashboard
```
Settings → Environment Variables → Add
```

---

## 📊 Folder Structure Reference

```
api/                  ← Vercel Serverless Functions (Node.js)
├── *.js             ← Each file = one endpoint
└── utils/           ← Shared utilities

frontend/            ← React App (Vite)
├── src/
│   ├── App.jsx      ← Main component
│   ├── main.jsx     ← Entry point
│   ├── components/  ← React components
│   ├── pages/       ← Page components
│   ├── hooks/       ← Custom hooks
│   └── services/    ← API client
├── public/          ← Static files
└── dist/            ← Built output (after npm run build)
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] No secrets in code
- [ ] GROQ_API_KEY in Vercel Settings only
- [ ] CORS_ORIGIN set correctly
- [ ] Environment variables use placeholders (@CORS_ORIGIN)
- [ ] .env.local not committed
- [ ] Error messages are user-friendly
- [ ] Input validation on all endpoints

---

## 🐛 Debugging Tips

### Check API Working
```bash
curl -v http://localhost:3000/api/health
```

### View Logs
```bash
# Local
npm run dev:api      # Logs in console

# Production
vercel logs <deployment-id>
vercel logs --follow # Real-time logs
```

### Common Issues

**GROQ_API_KEY not found**
```bash
# Local development
echo "GROQ_API_KEY=your-key" > .env.local

# Production
# Vercel Dashboard → Settings → Environment Variables
```

**CORS Error**
```bash
# Check CORS_ORIGIN
curl -H "Origin: http://localhost:3000" \
  http://localhost:3000/api/health
```

**Port Already in Use**
```bash
# Use different port
npm run dev:frontend -- --port 5174
```

---

## 📈 Performance Monitoring

### Local Development
```bash
# Vite provides build analysis
npm run build:frontend
# Check frontend/dist/ size

# Function size
# Should be < 50MB each
```

### Production
```bash
# Vercel Dashboard → Functions
# View: Invocations, Duration, Memory

# Lighthouse Check
# Open app in Chrome → DevTools → Lighthouse
```

---

## 🧪 Testing

### API Endpoints
```bash
npm run test:api    # Run test script
```

### Frontend Build
```bash
npm run build       # Build frontend
npm run preview     # Preview build locally
```

### Manual Testing
Use tools like:
- **Postman** - API testing
- **Insomnia** - API testing
- **Thunder Client** - VS Code extension
- **curl** - Command line

---

## 📚 Documentation Quick Links

| File | Purpose |
|------|---------|
| README.md | Overview & quick start |
| API_REFERENCE.md | Complete API docs |
| VERCEL_DEPLOYMENT.md | Deployment guide |
| SERVERLESS_ARCHITECTURE.md | Architecture details |
| PRODUCTION_CHECKLIST.md | Pre-deploy checklist |

---

## 🚀 Deploy Checklist

```bash
# 1. Build
npm run build:frontend

# 2. Test
npm run test:api

# 3. Commit
git add .
git commit -m "chore: production release v2.0.0"

# 4. Push
git push origin main

# 5. Vercel auto-deploys!

# 6. Verify
curl https://your-app.vercel.app/api/health
```

---

## 💡 Pro Tips

1. **Use `withCors` wrapper for new endpoints**
   ```javascript
   import { withCors } from './utils/cors.js';
   
   const handler = (req, res) => {
     // Your logic
   };
   
   export default withCors(handler, ['GET', 'POST']);
   ```

2. **Always validate input early**
   ```javascript
   import { validateComplaint } from './utils/validators.js';
   
   const validation = validateComplaint(data);
   if (!validation.valid) {
     return errorResponse(res, 400, validation.message);
   }
   ```

3. **Use structured logging**
   ```javascript
   import { logRequest, logResponse } from './utils/logger.js';
   
   logRequest(req, 'endpoint-name');
   logResponse(200, 'Success', 'endpoint-name', duration);
   ```

4. **Reuse Groq client**
   ```javascript
   import { getGroqClient } from './utils/groq.js';
   
   const groq = getGroqClient();  // Cached, not re-initialized
   ```

---

## 📞 Getting Help

1. **API Issues**: Check [API_REFERENCE.md](./API_REFERENCE.md)
2. **Deployment Issues**: Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
3. **Architecture Questions**: Check [SERVERLESS_ARCHITECTURE.md](./SERVERLESS_ARCHITECTURE.md)
4. **Pre-deployment**: Check [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)

---

**Last Updated:** January 2024  
**Version:** 2.0.0  
**Quick Reference for:** Developers & DevOps
