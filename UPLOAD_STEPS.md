# 🚀 Upload Your Tiles - Simple Steps

## What You Need to Upload

**Upload EVERYTHING from `E:\NASA_TILES\`**

Including:

- ✅ `images-metadata.json` file
- ✅ All 8 image folders (heic0206c, heic0503a, heic0506b, heic0910i, heic0910s, heic1502a, heic2007a, opo0328a)
- ✅ All subfolders and files inside each folder

---

## 🎯 Easiest Method: Use the Script I Created

### Step 1: Install Wrangler

Open Command Prompt and run:

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

(This will open your browser - login and authorize)

### Step 3: Create Bucket

```bash
wrangler r2 bucket create cosmic-canvas-tiles
```

### Step 4: Run the Upload Script

**Option A: Use PowerShell Script (Recommended)**

1. Right-click on `upload-tiles.ps1`
2. Select "Run with PowerShell"
3. Wait for upload to complete

**Option B: Use Batch Script**

1. Double-click `upload-tiles.bat`
2. Wait for upload to complete

**Option C: Manual Command**

```bash
cd E:\NASA_TILES
wrangler r2 object put cosmic-canvas-tiles --file=. --recursive
```

### Step 5: Enable Public Access

1. Go to https://dash.cloudflare.com/
2. Click on R2
3. Click on `cosmic-canvas-tiles` bucket
4. Go to "Settings" tab
5. Scroll to "Public access"
6. Click "Allow Access"
7. Click "Enable R2.dev subdomain"
8. **Copy the public URL** (looks like: `https://pub-xxxxxxxxxxxxx.r2.dev`)

---

## ⏱️ How Long Will It Take?

Depends on your internet upload speed:

**For ~2GB of tiles:**

- Fast internet (100 Mbps): ~5 minutes
- Medium internet (50 Mbps): ~10 minutes
- Slow internet (10 Mbps): ~45 minutes

**For ~5GB of tiles:**

- Fast internet (100 Mbps): ~12 minutes
- Medium internet (50 Mbps): ~25 minutes
- Slow internet (10 Mbps): ~2 hours

---

## ✅ Verify Upload

After upload completes, verify files are there:

### Method 1: Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Navigate to R2 → cosmic-canvas-tiles
3. You should see:
   - `images-metadata.json`
   - `heic0206c/` folder
   - `heic0503a/` folder
   - ... (all other folders)

### Method 2: Command Line

```bash
wrangler r2 object list cosmic-canvas-tiles
```

### Method 3: Test a File URL

Open in browser:

```
https://pub-xxxxx.r2.dev/images-metadata.json
```

(Replace with your actual R2 URL)

You should see the JSON file content!

---

## 🔧 What If Something Goes Wrong?

### "wrangler: command not found"

**Problem**: Wrangler not installed
**Solution**:

```bash
npm install -g wrangler
```

### "Authentication failed"

**Problem**: Not logged in
**Solution**:

```bash
wrangler login
```

### "Bucket already exists"

**Problem**: Bucket was already created
**Solution**: Skip bucket creation, proceed to upload

### Upload is stuck/slow

**Problem**: Slow internet or rate limiting
**Solution**:

- Be patient, it takes time for large files
- Try using Rclone instead (faster)
- Upload during off-peak hours

### Files not showing in dashboard

**Problem**: Upload still in progress or failed
**Solution**:

- Wait a few minutes
- Refresh the page
- Check command output for errors
- Try uploading again

---

## 📝 After Upload Checklist

- [ ] All 8 image folders uploaded
- [ ] images-metadata.json uploaded
- [ ] Verified files in Cloudflare dashboard
- [ ] Enabled public access
- [ ] Copied public URL
- [ ] Tested URL in browser (should show JSON file)

---

## 🎯 Next Step

Once upload is complete and verified:

1. Create `.env.local` file in your project root
2. Add this line:
   ```env
   NEXT_PUBLIC_TILES_BASE_URL=https://pub-xxxxxxxxxxxxx.r2.dev
   ```
   (Replace with YOUR actual R2 URL)
3. Test locally: `npm run dev`
4. Deploy to Vercel!

---

## 💡 Pro Tips

1. **Upload during off-peak hours** (late night) for faster speeds
2. **Don't close the terminal** while uploading
3. **Keep your computer awake** during upload
4. **Check your internet connection** is stable
5. **Use Rclone** if you have very large files (>10GB)

---

## 🆘 Still Having Issues?

If you're stuck:

1. Check the error message carefully
2. Read `UPLOAD_TILES_GUIDE.md` for detailed troubleshooting
3. Try the alternative Rclone method
4. Make sure your Cloudflare account is active
5. Verify you have enough storage (10GB free tier)

---

**You've got this! The upload is the hardest part, and it's just a waiting game! ⏳**
