# 🚀 DEPLOYMENT GUIDE

Panduan lengkap untuk deploy Kos-Sickness ke production.

---

## 🌐 Option 1: Deploy ke Vercel (Recommended)

### Pros:
- ✅ Paling mudah & cepat
- ✅ Free tier tersedia
- ✅ Automatic HTTPS
- ✅ Auto-deploy saat push ke GitHub
- ✅ Environment variables management built-in
- ✅ Serverless functions support

### Prerequisites:
1. Akun GitHub dengan repository Kos-Sickness
2. Akun Vercel (daftar via GitHub)
3. Groq API Key

### Step-by-Step:

#### 1. Persiapkan Repository

```bash
cd Kos_Sickness2
git init
git add .
git commit -m "Initial commit: Kos-Sickness v1.0.0"
git remote add origin https://github.com/your-username/kos-sickness.git
git branch -M main
git push -u origin main
```

#### 2. Login ke Vercel

1. Buka https://vercel.com
2. Klik "Log in" → Pilih "Continue with GitHub"
3. Authorize Vercel untuk akses GitHub

#### 3. Import Project

1. Di Vercel dashboard, klik "New Project"
2. Pilih repository "kos-sickness"
3. Klik "Import"

#### 4. Configure Build Settings

**Root Directory:** (biarkan default)

**Framework:** Menggunakan vercel.json yang sudah dibuat

**Build Command:** Akan auto-detect

**Output Directory:** Akan auto-detect

#### 5. Set Environment Variables

Sebelum deploy, klik "Environment Variables" dan tambahkan:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `YOUR_GROQ_API_KEY` |
| `NODE_ENV` | `production` |

#### 6. Deploy!

1. Klik tombol "Deploy"
2. Tunggu proses deployment (2-5 menit)
3. ✅ Aplikasi sudah live!

**Your URL akan:** `https://kos-sickness.vercel.app`

### Testing Production

```bash
# Test API
curl https://kos-sickness.vercel.app/api/health

# Open di browser
https://kos-sickness.vercel.app
```

### Auto-Deploy pada push

```bash
# Setiap kali Anda push ke main branch
git push origin main

# Vercel otomatis akan deploy perubahan
```

---

## 🔵 Option 2: Deploy ke Render

### Pros:
- ✅ Free tier tersedia
- ✅ Unlimited databases
- ✅ Good for small projects
- ✅ Custom domains support
- ✅ Cron jobs support

### Prerequisites:
1. Repository di GitHub
2. Akun Render
3. Groq API Key

### Step-by-Step:

#### 1. Push Repository ke GitHub

```bash
cd Kos_Sickness2
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/kos-sickness.git
git push -u origin main
```

#### 2. Login ke Render

1. Buka https://render.com
2. Klik "Sign up"
3. Pilih "Continue with GitHub"

#### 3. Create Backend Service

1. Klik "New +" → "Web Service"
2. Connect GitHub repository
3. Konfigurasi:
   - **Name:** `kos-sickness-api`
   - **Root Directory:** `backend`
   - **Runtime:** `node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. Environment Variables:
   ```
   GROQ_API_KEY=YOUR_GROQ_API_KEY
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://kos-sickness-frontend.onrender.com
   ```

5. Pilih instance: `Free` (atau upgrade sesuai kebutuhan)
6. Klik "Create Web Service"

#### 4. Create Frontend Service

1. Klik "New +" → "Static Site"
2. Connect GitHub repository
3. Konfigurasi:
   - **Name:** `kos-sickness-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Environment:
   - Add variable: `VITE_API_URL=https://kos-sickness-api.onrender.com`

5. Klik "Create Static Site"

#### 5. Wait for Deployment

- Backend URL: `https://kos-sickness-api.onrender.com`
- Frontend URL: `https://kos-sickness-frontend.onrender.com`

#### 6. Update CORS di Backend

Edit backend `.env.production`:
```
CORS_ORIGIN=https://kos-sickness-frontend.onrender.com
```

Push ke GitHub:
```bash
git add .env.production
git commit -m "Update CORS for production"
git push
```

---

## 🏢 Option 3: Self-Hosted (VPS)

### Pros:
- ✅ Full control
- ✅ Bisa custom domain
- ✅ No vendor lock-in

### Providers:
- DigitalOcean ($5/month)
- Linode ($5/month)
- AWS Lightsail ($3.5/month)
- Hetzner (€2.49/month)

### Basic Setup:

#### 1. SSH ke Server

```bash
ssh root@your_server_ip
```

#### 2. Install Node.js

```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. Clone Repository

```bash
git clone https://github.com/your-username/kos-sickness.git
cd kos-sickness
```

#### 4. Setup Backend

```bash
cd backend
npm install
cat > .env << EOF
GROQ_API_KEY=YOUR_GROQ_API_KEY
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
EOF
```

#### 5. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 start src/server.js --name "kos-sickness-api"
pm2 startup
pm2 save
```

#### 6. Build Frontend

```bash
cd ../frontend
npm install
VITE_API_URL=https://api.your-domain.com npm run build
```

#### 7. Serve Frontend dengan Nginx

```bash
sudo apt install nginx
sudo cp -r dist/* /var/www/html/
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 8. Setup Domain & SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --nginx -d your-domain.com
```

---

## ✅ Post-Deployment Checklist

- [ ] API health check working (`/api/health`)
- [ ] Analyze sickness endpoint responding
- [ ] Frontend loading properly
- [ ] Forms working correctly
- [ ] Error handling displaying properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate valid
- [ ] CORS properly configured
- [ ] API key secure (not exposed in frontend)
- [ ] Environment variables set correctly
- [ ] Database working (if added)
- [ ] Logging working properly
- [ ] Performance acceptable
- [ ] Monitoring/analytics enabled (optional)

---

## 📊 Monitoring & Analytics

### Vercel
- Dashboard otomatis menampilkan:
  - Deployment history
  - Performance metrics
  - Error logs
  - Environment variables

### Render
- Basic monitoring tersedia di dashboard
- Email alerts untuk deployment failures

### Self-Hosted
- Setup PM2 monitoring:
  ```bash
  pm2 install pm2-logrotate
  pm2 install pm2-auto-pull
  ```
- Install CloudWatch atau similar untuk logs

---

## 🔒 Production Security Checklist

- [ ] Environment variables tidak hardcoded
- [ ] .env file dalam .gitignore
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured (not `*`)
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] SQL Injection prevention (if database used)
- [ ] XSS prevention implemented
- [ ] CSRF tokens (if applicable)
- [ ] API key rotated regularly
- [ ] Logs monitored for errors
- [ ] Backups configured
- [ ] Monitoring alerts setup

---

## 🚨 Rollback Plan

### Vercel
```bash
# Revert to previous deployment
# Di Vercel dashboard → Deployments → Select → Rollback
```

### Render
```bash
# Redeploy previous version
# Services → Select service → Deploys → Select → Revert
```

### Git
```bash
# Local rollback
git revert HEAD
git push

# Auto-deploy akan trigger
```

---

## 📈 Scaling Tips

### When to Scale:
- Traffic > 1000 users/day
- Response time > 2s
- Database queries slow

### Scaling Options:
1. **Vercel:** Automatic scaling
2. **Render:** Upgrade to Pro plan
3. **Self-hosted:** Add load balancer + multiple instances
4. **Database:** Add caching (Redis), optimize queries

---

## 💰 Cost Estimation

| Provider | Monthly Cost | Limits |
|----------|-------------|--------|
| Vercel | Free-$20/mo | Great for startups |
| Render | Free-$7/mo | Good for small projects |
| DigitalOcean | $5-$40/mo | Full control |
| AWS | Varies | Pay as you go |

---

## 🎯 Recommended Setup

**For UTS Project:**
✅ **Deploy to Vercel** (recommended)
- Paling simple & fast
- Free tier sufficient
- Best documentation

**For Production:**
✅ **DigitalOcean App Platform** atau **Render Pro**
- Better control
- More reliable
- Good pricing

---

## 📞 Deployment Support

### Documentation Links:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [DigitalOcean Docs](https://www.digitalocean.com/docs)

### Troubleshooting:
- Check deployment logs
- Verify environment variables
- Test API endpoints
- Check CORS headers
- Review error messages

---

**Happy Deployment! 🚀**

Last Updated: January 15, 2024
