# ✅ Deployment Checklist

Follow these steps in order to deploy Cosmic Canvas to production.

---

## Phase 1: Prepare Cloud Storage (Cloudflare R2)

### Step 1: Create Cloudflare Account

- [ ] Go to https://dash.cloudflare.com/
- [ ] Sign up for free account
- [ ] Verify email

### Step 2: Create R2 Bucket

- [ ] Navigate to R2 Object Storage
- [ ] Click "Create bucket"
- [ ] Name: `cosmic-canvas-tiles`
- [ ] Click "Create bucket"

### Step 3: Enable Public Access

- [ ] Click on your bucket
- [ ] Go to "Settings" tab
- [ ] Scroll to "Public access"
- [ ] Click "Allow Access"
- [ ] Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)
- [ ] Save this URL - you'll need it later!

### Step 4: Get API Credentials (Optional, for programmatic upload)

- [ ] Go to R2 → Manage R2 API Tokens
- [ ] Click "Create API Token"
- [ ] Name: "Cosmic Canvas Upload"
- [ ] Permissions: Object Read & Write
- [ ] Click "Create API Token"
- [ ] Copy Access Key ID and Secret Access Key
- [ ] Save these securely!

---

## Phase 2: Upload Tiles to R2

### Option A: Using Cloudflare Dashboard (Easiest)

- [ ] Go to your R2 bucket
- [ ] Click "Upload"
- [ ] Drag and drop `images-metadata.json`
- [ ] Drag and drop each image folder (heic0206c, heic0503a, etc.)
- [ ] Wait for upload to complete (may take hours)
- [ ] Verify files are uploaded

### Option B: Using Wrangler CLI (Recommended)

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Upload metadata
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file="E:\NASA_TILES\images-metadata.json"

# Upload each image folder (repeat for all)
cd E:\NASA_TILES\heic0206c
wrangler r2 object put cosmic-canvas-tiles/heic0206c --file=. --recursive
```

- [ ] Install Wrangler CLI
- [ ] Login to Cloudflare
- [ ] Upload metadata file
- [ ] Upload each image folder
- [ ] Verify uploads in R2 dashboard

### Option C: Using Rclone (Best for large files)

```bash
# Install rclone from https://rclone.org/downloads/

# Configure rclone
rclone config
# Choose: Cloudflare R2
# Name: r2
# Enter your credentials

# Sync files
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ --progress
```

- [ ] Install rclone
- [ ] Configure for Cloudflare R2
- [ ] Run sync command
- [ ] Verify files in R2 dashboard

---

## Phase 3: Update Application Code

### Step 1: Create Environment File

- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_TILES_BASE_URL` with your R2 public URL
- [ ] Save the file

Example `.env.local`:

```env
NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxxxxxxxxxx.r2.dev
```

### Step 2: Update API Routes

- [ ] Update `app/api/images/route.ts` to use R2 API
- [ ] Update tile serving to use R2 URLs
- [ ] Test locally: `npm run dev`
- [ ] Verify images load from R2

### Step 3: Test Locally

```bash
npm run dev
```

- [ ] Open http://localhost:3000
- [ ] Go to dashboard
- [ ] Verify images load
- [ ] Click an image
- [ ] Verify tiles load and zoom works
- [ ] Test annotations
- [ ] Test PDF export

---

## Phase 4: Deploy to Vercel

### Step 1: Prepare Git Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/cosmic-canvas.git
git branch -M main
git push -u origin main
```

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify all files are pushed

### Step 2: Deploy to Vercel

- [ ] Go to https://vercel.com/
- [ ] Sign up / Login (use GitHub account)
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Configure project:
  - Framework Preset: Next.js
  - Root Directory: ./
  - Build Command: `npm run build`
  - Output Directory: .next
- [ ] Click "Deploy"

### Step 3: Configure Environment Variables

- [ ] Go to Project Settings
- [ ] Click "Environment Variables"
- [ ] Add: `NEXT_PUBLIC_TILES_BASE_URL`
- [ ] Value: Your R2 public URL
- [ ] Click "Save"
- [ ] Redeploy if needed

### Step 4: Test Production Deployment

- [ ] Open your Vercel URL (e.g., cosmic-canvas.vercel.app)
- [ ] Test all features:
  - [ ] Landing page loads
  - [ ] Dashboard shows images
  - [ ] Images open in viewer
  - [ ] Zoom and pan work
  - [ ] Annotations work
  - [ ] PDF export works
  - [ ] Coordinate search works

---

## Phase 5: Configure Custom Domain (Optional)

### If you have a domain:

- [ ] Go to Vercel Project Settings
- [ ] Click "Domains"
- [ ] Add your domain
- [ ] Update DNS records as instructed
- [ ] Wait for DNS propagation
- [ ] Test with your domain

---

## Phase 6: Optimize and Monitor

### Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Check Lighthouse scores
- [ ] Optimize images if needed
- [ ] Monitor R2 usage

### Monitoring

- [ ] Check Vercel deployment logs
- [ ] Monitor R2 storage usage
- [ ] Check bandwidth usage
- [ ] Set up alerts if needed

---

## 🎉 Deployment Complete!

Your Cosmic Canvas is now live! Share it with the world:

- Production URL: `https://your-app.vercel.app`
- GitHub Repo: `https://github.com/yourusername/cosmic-canvas`

---

## 📊 Usage Monitoring

### Cloudflare R2 Dashboard

- Storage used: \_\_\_ GB / 10 GB
- Requests: \_\_\_ / 10M per month
- Bandwidth: Unlimited ✅

### Vercel Dashboard

- Bandwidth: \_\_\_ GB / 100 GB per month
- Build time: \_\_\_ minutes / 6000 per month
- Deployments: Unlimited ✅

---

## 🆘 Troubleshooting

### Images not loading

1. Check R2 public URL is correct
2. Verify bucket has public access enabled
3. Check browser console for errors
4. Verify environment variable in Vercel

### Tiles not loading

1. Check tile files exist in R2
2. Verify DZI file is accessible
3. Check CORS settings
4. Test tile URL directly in browser

### Deployment failed

1. Check build logs in Vercel
2. Verify all dependencies are installed
3. Test build locally: `npm run build`
4. Check for TypeScript errors

---

## 📞 Need Help?

- Cloudflare R2 Docs: https://developers.cloudflare.com/r2/
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## 🔄 Future Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy your changes!
