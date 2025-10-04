# 🚀 Cosmic Canvas - Deployment Guide

## 🎯 Current Situation Analysis

### Your Setup

- **Application**: Next.js app (small, ~50MB)
- **Tiles Storage**: `E:\NASA_TILES\` (large, potentially GBs)
- **Local Tiles**: `public/tiles/` (small subset)
- **Challenge**: Tiles are too large for traditional hosting

### The Problem

Most free hosting platforms have storage limits:

- Vercel: 100MB per deployment
- Netlify: 100MB per deployment
- GitHub Pages: 1GB total
- Your tiles: Potentially several GBs

---

## 💡 Solution: Hybrid Deployment Strategy

We'll split your application into two parts:

1. **Application** → Deploy to Vercel/Netlify (FREE)
2. **Tiles** → Store on cloud storage (FREE tier available)

---

## 🎨 Deployment Options (Ranked by Ease)

### Option 1: Vercel + Cloudflare R2 (RECOMMENDED) ⭐

**Best for: Easy setup, generous free tier**

#### Why This Works

- Vercel: Free Next.js hosting (unlimited bandwidth)
- Cloudflare R2: 10GB free storage, no egress fees
- Total Cost: $0/month

#### Setup Steps

**Step 1: Prepare Your Tiles**

```bash
# Your tiles are currently at: E:\NASA_TILES\
# Keep this structure:
E:\NASA_TILES\
├── images-metadata.json
├── heic0206c\
│   ├── heic0206c.dzi
│   ├── heic0206c_thumb.jpg
│   └── heic0206c_files\
└── ...
```

**Step 2: Sign Up for Cloudflare R2**

1. Go to https://dash.cloudflare.com/
2. Sign up (free account)
3. Navigate to R2 Object Storage
4. Create a bucket: `cosmic-canvas-tiles`
5. Enable public access for the bucket

**Step 3: Upload Tiles to R2**

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Upload your tiles
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file="E:\NASA_TILES\images-metadata.json"

# Upload each image folder
wrangler r2 object put cosmic-canvas-tiles/heic0206c --file="E:\NASA_TILES\heic0206c" --recursive
# Repeat for all images...
```

**Step 4: Update Your Code**
I'll create the updated API route for you.

**Step 5: Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Pros:**

- ✅ Completely free
- ✅ No egress fees (unlimited bandwidth)
- ✅ Fast CDN
- ✅ Easy setup

**Cons:**

- ⚠️ 10GB storage limit (should be enough for ~20-30 high-res images)

---

### Option 2: Vercel + AWS S3 (FREE TIER)

**Best for: More storage needed (5GB free)**

#### Setup Steps

**Step 1: Create AWS Account**

1. Go to https://aws.amazon.com/
2. Sign up for free tier (12 months free)
3. Navigate to S3

**Step 2: Create S3 Bucket**

1. Create bucket: `cosmic-canvas-tiles`
2. Region: Choose closest to your users
3. Uncheck "Block all public access"
4. Enable static website hosting

**Step 3: Upload Tiles**

```bash
# Install AWS CLI
# Download from: https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure
# Enter your Access Key ID and Secret Access Key

# Upload tiles
aws s3 sync E:\NASA_TILES\ s3://cosmic-canvas-tiles/ --acl public-read
```

**Step 4: Update Code**
Change tile URLs to: `https://cosmic-canvas-tiles.s3.amazonaws.com/`

**Pros:**

- ✅ Free for 12 months
- ✅ 5GB storage
- ✅ 15GB bandwidth/month
- ✅ Reliable

**Cons:**

- ⚠️ Requires credit card
- ⚠️ Charges after free tier expires
- ⚠️ More complex setup

---

### Option 3: GitHub Pages + GitHub LFS (LIMITED)

**Best for: Small projects only**

#### Why This Might Not Work

- GitHub LFS: 1GB free storage
- Bandwidth: 1GB/month
- Your tiles: Likely exceed this

**Only use if:**

- You have < 1GB of tiles
- Low traffic expected

---

### Option 4: Self-Hosting (FREE but requires server)

**Best for: You have a spare computer/server**

#### Requirements

- Computer that stays on 24/7
- Static IP or Dynamic DNS
- Port forwarding setup

#### Setup Steps

1. Keep tiles on `E:\NASA_TILES\`
2. Deploy Next.js app locally
3. Use ngrok or Cloudflare Tunnel for public access

**Pros:**

- ✅ Completely free
- ✅ Unlimited storage (your hard drive)
- ✅ Full control

**Cons:**

- ⚠️ Requires technical knowledge
- ⚠️ Computer must stay on
- ⚠️ Slower than CDN
- ⚠️ Security concerns

---

## 🛠️ Implementation: Recommended Setup (Vercel + Cloudflare R2)

### Step-by-Step Guide

#### Phase 1: Prepare Application

**1. Update Environment Variables**
Create `.env.local`:

```env
# Cloudflare R2 Configuration
NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxx.r2.dev
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=cosmic-canvas-tiles
```

**2. Update API Route**
I'll create an updated version that works with R2.

**3. Test Locally**

```bash
npm run dev
# Verify tiles load from R2
```

#### Phase 2: Upload Tiles to R2

**Option A: Using Wrangler CLI (Recommended)**

```bash
# Install
npm install -g wrangler

# Login
wrangler login

# Create bucket
wrangler r2 bucket create cosmic-canvas-tiles

# Upload files
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file=images-metadata.json

# Upload each image folder
for /d %i in (*) do wrangler r2 object put cosmic-canvas-tiles/%i --file=%i --recursive
```

**Option B: Using Cloudflare Dashboard (Easier)**

1. Go to R2 dashboard
2. Click "Upload"
3. Drag and drop folders
4. Wait for upload (may take hours for large files)

**Option C: Using Rclone (Best for large files)**

```bash
# Install rclone
# Download from: https://rclone.org/downloads/

# Configure
rclone config
# Choose Cloudflare R2
# Enter credentials

# Sync files
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ --progress
```

#### Phase 3: Deploy Application

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cosmic-canvas.git
git push -u origin main
```

**2. Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**3. Configure Environment Variables in Vercel**

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables from `.env.local`

---

## 💰 Cost Breakdown

### Free Tier Limits

#### Cloudflare R2 (FREE Forever)

- Storage: 10GB
- Class A Operations: 1M/month (uploads)
- Class B Operations: 10M/month (downloads)
- Egress: UNLIMITED (no bandwidth charges!)

#### Vercel (FREE Forever)

- Bandwidth: 100GB/month
- Build time: 6000 minutes/month
- Deployments: Unlimited
- Serverless functions: 100GB-hours

### What This Means for You

- **~20-30 high-res images**: FREE
- **Unlimited visitors**: FREE (no bandwidth charges)
- **Unlimited deployments**: FREE

### If You Exceed Free Tier

- Cloudflare R2: $0.015/GB/month (very cheap)
- Vercel: $20/month for Pro plan

---

## 📊 Storage Optimization Tips

### Reduce Tile Size

**1. Optimize JPEG Quality**

```javascript
// In generate-tiles script
.jpeg({ quality: 80 }) // Reduce from 90 to 80
// Saves ~30% space with minimal quality loss
```

**2. Use WebP Format**

```javascript
.webp({ quality: 80 }) // Even better compression
// Saves ~50% space vs JPEG
```

**3. Reduce Tile Size**

```javascript
tileSize: 256; // Current
tileSize: 512; // Larger tiles = fewer files = less storage
```

**4. Limit Zoom Levels**

```javascript
// Only generate up to level 14 instead of 16
// Saves significant space
```

### Estimate Your Storage Needs

**Formula:**

```
Total Size = Sum of (Image Width × Image Height × Bytes per Pixel × Compression Factor)

Example for 40,000 × 12,788 image:
= 40,000 × 12,788 × 3 bytes × 0.1 (JPEG compression)
≈ 150 MB per image

For 8 images: ~1.2 GB
```

---

## 🔧 Code Updates Needed

I'll create these files for you:

1. **Updated API route** for R2 integration
2. **Environment configuration** file
3. **Deployment scripts** for easy deployment
4. **Upload script** for tiles

---

## 🚨 Important Considerations

### Security

- ✅ Tiles are public (read-only)
- ✅ No sensitive data in tiles
- ✅ API keys in environment variables
- ⚠️ Don't commit `.env.local` to git

### Performance

- ✅ R2 has global CDN
- ✅ Tiles cached by browser
- ✅ Fast loading worldwide
- ⚠️ First load may be slower

### Scalability

- ✅ Handles unlimited traffic
- ✅ Auto-scales with demand
- ✅ No server management
- ⚠️ Storage limit: 10GB free

---

## 📝 Quick Start Checklist

- [ ] Sign up for Cloudflare account
- [ ] Create R2 bucket
- [ ] Install Wrangler CLI
- [ ] Upload tiles to R2
- [ ] Update environment variables
- [ ] Test locally
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Configure Vercel environment variables
- [ ] Test production deployment
- [ ] Share with the world! 🌍

---

## 🆘 Troubleshooting

### Tiles Not Loading

1. Check R2 bucket is public
2. Verify CORS settings
3. Check environment variables
4. Inspect browser console for errors

### Upload Failed

1. Check internet connection
2. Verify Cloudflare credentials
3. Try smaller batches
4. Use rclone for large files

### Deployment Failed

1. Check build logs in Vercel
2. Verify all dependencies installed
3. Check environment variables
4. Try local build first: `npm run build`

---

## 🎉 Next Steps

Once deployed, you'll have:

- ✅ Public URL (e.g., cosmic-canvas.vercel.app)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Zero maintenance

**Want me to create the updated code files for R2 integration?**
