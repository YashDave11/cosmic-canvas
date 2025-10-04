# 📤 Upload Tiles to Cloudflare R2 - Complete Guide

## What to Upload

**Upload EVERYTHING from `E:\NASA_TILES\`**

This includes:

- ✅ `images-metadata.json` (the main index file)
- ✅ All image folders (heic0206c, heic0503a, heic0506b, etc.)
- ✅ All subfolders inside each image folder
- ✅ All tile files (.jpg, .dzi, \_thumb.jpg)

**Your folder structure:**

```
E:\NASA_TILES\
├── images-metadata.json          ← Upload this
├── heic0206c\                     ← Upload this entire folder
│   ├── heic0206c.dzi
│   ├── heic0206c_thumb.jpg
│   └── heic0206c_files\
│       ├── 0\
│       │   └── 0_0.jpg
│       ├── 1\
│       │   ├── 0_0.jpg
│       │   └── 1_0.jpg
│       └── ... (many more)
├── heic0503a\                     ← Upload this entire folder
│   └── ... (same structure)
└── ... (all other image folders)
```

---

## Method 1: Wrangler CLI (RECOMMENDED) ⭐

### Step 1: Install Node.js (if not already installed)

1. Go to https://nodejs.org/
2. Download and install LTS version
3. Verify installation:

```bash
node --version
npm --version
```

### Step 2: Install Wrangler CLI

Open Command Prompt or PowerShell and run:

```bash
npm install -g wrangler
```

Verify installation:

```bash
wrangler --version
```

### Step 3: Login to Cloudflare

```bash
wrangler login
```

- This will open your browser
- Login to your Cloudflare account
- Authorize Wrangler

### Step 4: Create R2 Bucket

```bash
wrangler r2 bucket create cosmic-canvas-tiles
```

### Step 5: Upload Files

**Option A: Upload entire directory at once (EASIEST)**

```bash
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles --file=. --recursive
```

**Option B: Upload files one by one (more control)**

First, upload the metadata file:

```bash
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file="E:\NASA_TILES\images-metadata.json"
```

Then, upload each image folder:

```bash
# For heic0206c
cd E:\NASA_TILES\heic0206c
wrangler r2 object put cosmic-canvas-tiles/heic0206c --file=. --recursive

# For heic0503a
cd E:\NASA_TILES\heic0503a
wrangler r2 object put cosmic-canvas-tiles/heic0503a --file=. --recursive

# Repeat for all other folders...
```

**Option C: Use PowerShell script to upload all folders**

Save this as `upload-all.ps1`:

```powershell
# Navigate to tiles directory
cd E:\NASA_TILES

# Upload metadata
Write-Host "Uploading metadata..." -ForegroundColor Green
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file="images-metadata.json"

# Get all subdirectories
$folders = Get-ChildItem -Directory

# Upload each folder
foreach ($folder in $folders) {
    Write-Host "Uploading $($folder.Name)..." -ForegroundColor Green
    cd $folder.FullName
    wrangler r2 object put "cosmic-canvas-tiles/$($folder.Name)" --file=. --recursive
    cd ..
}

Write-Host "Upload complete!" -ForegroundColor Green
```

Run it:

```powershell
powershell -ExecutionPolicy Bypass -File upload-all.ps1
```

---

## Method 2: Rclone (BEST for large files) ⭐⭐⭐

Rclone is faster and more reliable for large uploads.

### Step 1: Install Rclone

1. Go to https://rclone.org/downloads/
2. Download Windows version
3. Extract to a folder (e.g., `C:\rclone\`)
4. Add to PATH or use full path

### Step 2: Configure Rclone for Cloudflare R2

Run:

```bash
rclone config
```

Follow these prompts:

```
n) New remote
name> r2
Storage> cloudflare
account_id> [Your Cloudflare Account ID]
access_key_id> [Your R2 Access Key ID]
secret_access_key> [Your R2 Secret Access Key]
endpoint> (leave blank)
acl> (leave blank)
y) Yes this is OK
q) Quit config
```

**Where to get credentials:**

1. Go to https://dash.cloudflare.com/
2. Click on R2
3. Click "Manage R2 API Tokens"
4. Create API Token
5. Copy Account ID, Access Key ID, and Secret Access Key

### Step 3: Create Bucket

```bash
rclone mkdir r2:cosmic-canvas-tiles
```

### Step 4: Upload Everything

```bash
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ --progress --transfers 8
```

**This command will:**

- ✅ Upload all files and folders
- ✅ Preserve folder structure
- ✅ Show progress
- ✅ Use 8 parallel transfers (faster)
- ✅ Skip files that already exist

**Recommended options for large uploads:**

```bash
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ \
  --progress \
  --transfers 8 \
  --checkers 16 \
  --stats 10s \
  --stats-one-line \
  --retries 3
```

---

## Method 3: Wrangler with Batch Script (Windows)

Create a file `upload-tiles.bat`:

```batch
@echo off
echo Starting upload to Cloudflare R2...
echo.

cd /d E:\NASA_TILES

echo Uploading metadata file...
wrangler r2 object put cosmic-canvas-tiles/images-metadata.json --file=images-metadata.json
echo.

echo Uploading image folders...
for /d %%i in (*) do (
    echo Uploading %%i...
    cd %%i
    wrangler r2 object put cosmic-canvas-tiles/%%i --file=. --recursive
    cd ..
    echo.
)

echo Upload complete!
pause
```

Double-click to run it!

---

## Verification

After upload, verify files are there:

### Using Wrangler:

```bash
# List all files
wrangler r2 object list cosmic-canvas-tiles

# Check specific folder
wrangler r2 object list cosmic-canvas-tiles --prefix=heic0206c/
```

### Using Cloudflare Dashboard:

1. Go to https://dash.cloudflare.com/
2. Navigate to R2
3. Click on `cosmic-canvas-tiles` bucket
4. Browse files

You should see:

```
cosmic-canvas-tiles/
├── images-metadata.json
├── heic0206c/
│   ├── heic0206c.dzi
│   ├── heic0206c_thumb.jpg
│   └── heic0206c_files/
│       └── ... (all tiles)
├── heic0503a/
│   └── ...
└── ... (all other folders)
```

---

## Enable Public Access

After upload, make the bucket public:

1. Go to Cloudflare Dashboard → R2
2. Click on `cosmic-canvas-tiles`
3. Go to "Settings" tab
4. Scroll to "Public access"
5. Click "Allow Access"
6. Click "Enable R2.dev subdomain"
7. Copy the public URL (e.g., `https://pub-xxxxxxxxxxxxx.r2.dev`)

**Save this URL!** You'll need it for your `.env.local` file.

---

## Troubleshooting

### "Command not found: wrangler"

- Wrangler not installed or not in PATH
- Solution: Run `npm install -g wrangler` again

### "Authentication failed"

- Not logged in
- Solution: Run `wrangler login`

### "Bucket already exists"

- Bucket was already created
- Solution: Skip bucket creation, proceed to upload

### Upload is very slow

- Use rclone instead of wrangler
- Increase `--transfers` number
- Check your internet speed

### "Too many requests"

- Hitting rate limits
- Solution: Add delays between uploads or use rclone

### Files not showing in dashboard

- Wait a few minutes for sync
- Refresh the page
- Check if upload actually completed

---

## Estimated Upload Time

Based on typical internet speeds:

**For ~2GB of tiles:**

- 10 Mbps upload: ~45 minutes
- 25 Mbps upload: ~18 minutes
- 50 Mbps upload: ~9 minutes
- 100 Mbps upload: ~4.5 minutes

**For ~5GB of tiles:**

- 10 Mbps upload: ~1.8 hours
- 25 Mbps upload: ~45 minutes
- 50 Mbps upload: ~22 minutes
- 100 Mbps upload: ~11 minutes

---

## What Happens During Upload

```
1. Wrangler/Rclone reads files from E:\NASA_TILES\
   ↓
2. Compresses and uploads to Cloudflare
   ↓
3. Cloudflare stores in R2 bucket
   ↓
4. Files distributed to global CDN
   ↓
5. Available worldwide via public URL
```

---

## After Upload Checklist

- [ ] All folders uploaded
- [ ] images-metadata.json uploaded
- [ ] Verified files in dashboard
- [ ] Enabled public access
- [ ] Copied public URL
- [ ] Tested a file URL in browser
- [ ] Ready to deploy app!

---

## Quick Reference

### Upload with Wrangler (one command):

```bash
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles --file=. --recursive
```

### Upload with Rclone (one command):

```bash
rclone sync E:\NASA_TILES\ r2:cosmic-canvas-tiles/ --progress
```

### Check upload status:

```bash
wrangler r2 object list cosmic-canvas-tiles
```

### Get public URL:

Cloudflare Dashboard → R2 → cosmic-canvas-tiles → Settings → Public access

---

## Next Steps

After successful upload:

1. ✅ Copy your R2 public URL
2. ✅ Create `.env.local` in your project:
   ```env
   NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxx.r2.dev
   ```
3. ✅ Test locally: `npm run dev`
4. ✅ Deploy to Vercel
5. ✅ Celebrate! 🎉

---

**Recommended Method: Use Rclone for fastest and most reliable upload!**
