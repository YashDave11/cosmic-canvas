# ⚡ Quick Reference - Deployment Commands

## 📤 Upload Tiles to R2

### One-Time Setup

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create bucket
wrangler r2 bucket create cosmic-canvas-tiles
```

### Upload Everything (Choose ONE)

**Method 1: Use the script (Easiest)**

```bash
# PowerShell
.\upload-tiles.ps1

# OR Batch
upload-tiles.bat
```

**Method 2: Single command**

```bash
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles --file=. --recursive
```

**Method 3: Rclone (Fastest)**

```bash
# Configure once
rclone config

# Upload
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ --progress
```

---

## 🔍 Verify Upload

```bash
# List all files
wrangler r2 object list cosmic-canvas-tiles

# Check specific folder
wrangler r2 object list cosmic-canvas-tiles --prefix=heic0206c/
```

---

## 🌐 Enable Public Access

1. Go to: https://dash.cloudflare.com/
2. R2 → cosmic-canvas-tiles → Settings
3. Enable "Public access"
4. Copy URL: `https://pub-xxxxx.r2.dev`

---

## 💻 Update Your Code

Create `.env.local`:

```env
NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxxxxxxxxxx.r2.dev
```

---

## 🧪 Test Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser
http://localhost:3000
```

---

## 🚀 Deploy to Vercel

### Method 1: Vercel Website

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cosmic-canvas.git
git push -u origin main

# Then:
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variable: NEXT_PUBLIC_TILES_BASE_URL
# 4. Deploy
```

### Method 2: Vercel CLI

```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📊 Check Status

### Cloudflare R2

```bash
# List buckets
wrangler r2 bucket list

# Check storage usage
# Go to: https://dash.cloudflare.com/ → R2
```

### Vercel

```bash
# List deployments
vercel ls

# Check logs
vercel logs
```

---

## 🔧 Common Issues

### Wrangler not found

```bash
npm install -g wrangler
```

### Not authenticated

```bash
wrangler login
```

### Bucket already exists

```bash
# Skip creation, proceed to upload
```

### Files not uploading

```bash
# Check internet connection
# Try rclone instead
# Check Cloudflare status
```

---

## 📁 File Structure

### What to Upload

```
E:\NASA_TILES\              ← Upload ALL of this
├── images-metadata.json    ← Required
├── heic0206c\              ← Required
├── heic0503a\              ← Required
├── heic0506b\              ← Required
├── heic0910i\              ← Required
├── heic0910s\              ← Required
├── heic1502a\              ← Required
├── heic2007a\              ← Required
└── opo0328a\               ← Required
```

### Result in R2

```
cosmic-canvas-tiles/
├── images-metadata.json
├── heic0206c/
│   ├── heic0206c.dzi
│   ├── heic0206c_thumb.jpg
│   └── heic0206c_files/
├── heic0503a/
└── ... (all folders)
```

---

## 🎯 Complete Workflow

```bash
# 1. Upload tiles
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles --file=. --recursive

# 2. Enable public access (in dashboard)
# Copy URL: https://pub-xxxxx.r2.dev

# 3. Update code
echo NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxx.r2.dev > .env.local

# 4. Test locally
npm run dev

# 5. Deploy
git push
vercel --prod
```

---

## 📞 Help Resources

- **Detailed Guide**: `UPLOAD_TILES_GUIDE.md`
- **Step-by-Step**: `UPLOAD_STEPS.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## ⏱️ Time Estimates

- Setup: 15 minutes
- Upload: 1-4 hours (depends on internet)
- Deploy: 10 minutes
- **Total**: 2-5 hours

---

## 💰 Cost

- Cloudflare R2: **FREE** (10GB)
- Vercel: **FREE** (100GB bandwidth)
- **Total**: **$0/month**

---

**Save this file for quick reference! 📌**
