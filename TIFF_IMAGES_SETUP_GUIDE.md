# 🖼️ TIFF Images Setup Guide

## Overview

This system automatically scans for images in `E:\NASAimages\`, generates tiles, and displays them on the dashboard.

## Quick Start

### Step 1: Generate Tiles for Your TIFF Image

```bash
node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
```

This will:

- ✅ Scan `E:\NASAimages\` for all images (TIFF, JPG, PNG, WebP)
- ✅ Generate tiles for each image in `E:\NASA_TILES\[image-name]\`
- ✅ Create thumbnails automatically
- ✅ Generate metadata file (`images-metadata.json`)

### Step 2: Start Your Dev Server

```bash
npm run dev
```

### Step 3: View on Dashboard

1. Go to `http://localhost:3000/dashboard`
2. Your images will appear automatically!
3. Click any image to view it

## File Structure

```
E:\NASAimages\
  ├── heic2007a.tif          ← Your TIFF image
  ├── another-image.jpg      ← Add more images here
  └── ...

E:\NASA_TILES\
  ├── heic2007a\
  │   ├── heic2007a.dzi      ← DZI manifest
  │   ├── heic2007a_files\   ← Tile folders (0, 1, 2, ...)
  │   └── heic2007a_thumb.jpg ← Thumbnail
  ├── another-image\
  │   └── ...
  └── images-metadata.json   ← Metadata for all images
```

## Adding More Images

### Method 1: Automatic Scan (Recommended)

1. **Add images** to `E:\NASAimages\`
2. **Run the scan script:**
   ```bash
   node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
   ```
3. **Refresh dashboard** - New images appear automatically!

### Method 2: Single Image

```bash
node scripts/generate-tiles-custom.js E:\NASAimages\my-image.tif E:\NASA_TILES my-image
```

## Supported Formats

- ✅ TIFF (.tif, .tiff)
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)

## How It Works

### 1. Tile Generation

The script:

- Reads your large image (TIFF, JPG, etc.)
- Splits it into 512×512 pixel tiles
- Creates multiple zoom levels
- Generates a DZI manifest file
- Creates a thumbnail for the dashboard

### 2. API Endpoints

**GET /api/images**

- Returns list of all available images
- Reads from `images-metadata.json`

**GET /api/tiles/[imageId]/[...path]**

- Serves DZI files and tile images
- Handles caching for performance

### 3. Dashboard

- Fetches images from `/api/images`
- Displays them as cards
- Clicking opens the viewer

## Customization

### Change Image Display Name

Edit the metadata file: `E:\NASA_TILES\images-metadata.json`

```json
{
  "id": "heic2007a",
  "name": "Tapestry of Blazing Starbirth",  ← Change this
  "description": "Custom description",       ← And this
  ...
}
```

### Change Tile Quality

Edit `scripts/generate-tiles-custom.js`:

```javascript
.tile({
  size: 512,
  overlap: 1,
  layout: "dz",
  format: "jpeg",
  quality: 85,  ← Change this (1-100)
})
```

### Change Thumbnail Size

Edit `scripts/generate-tiles-custom.js`:

```javascript
.resize(400, 300, {  ← Change dimensions
  fit: "cover",
  position: "center",
})
```

## Troubleshooting

### Images Not Showing on Dashboard?

1. **Check metadata file exists:**

   ```
   E:\NASA_TILES\images-metadata.json
   ```

2. **Check API response:**

   - Open `http://localhost:3000/api/images`
   - Should show JSON with your images

3. **Check console:**
   - Press F12 in browser
   - Look for errors

### Tile Generation Failed?

1. **Check Sharp is installed:**

   ```bash
   npm install sharp
   ```

2. **Check file path is correct:**

   - Use full path: `E:\NASAimages\heic2007a.tif`
   - Check file exists

3. **Check disk space:**
   - Tiles can be large (100MB-1GB per image)

### TIFF Not Supported?

Sharp supports TIFF by default. If you get errors:

```bash
npm install sharp --force
```

## Performance Tips

### For Large TIFF Files (>500MB)

1. **Increase Node memory:**

   ```bash
   node --max-old-space-size=8192 scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
   ```

2. **Process one at a time:**
   ```bash
   node scripts/generate-tiles-custom.js E:\NASAimages\image1.tif E:\NASA_TILES image1
   node scripts/generate-tiles-custom.js E:\NASAimages\image2.tif E:\NASA_TILES image2
   ```

### For Many Images

The scan script processes images sequentially to avoid memory issues.

## Batch Operations

### Generate Tiles for All Images

```bash
node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
```

### Regenerate Single Image

```bash
node scripts/generate-tiles-custom.js E:\NASAimages\heic2007a.tif E:\NASA_TILES heic2007a
```

### Update Metadata Only

Edit `E:\NASA_TILES\images-metadata.json` directly, then refresh dashboard.

## Advanced Usage

### Custom Tile Size

Edit script to use 256×256 or 1024×1024 tiles:

```javascript
.tile({
  size: 256,  ← Smaller = more tiles, faster loading
  ...
})
```

### Different Output Format

Change from JPEG to WebP for better compression:

```javascript
.tile({
  format: "webp",
  quality: 85,
  ...
})
```

### Parallel Processing

For multiple images, you can run multiple instances:

```bash
# Terminal 1
node scripts/generate-tiles-custom.js E:\NASAimages\image1.tif E:\NASA_TILES image1

# Terminal 2
node scripts/generate-tiles-custom.js E:\NASAimages\image2.tif E:\NASA_TILES image2
```

## Maintenance

### Clean Up Old Tiles

Delete folders in `E:\NASA_TILES\` for images you no longer need.

### Regenerate All

1. Delete `E:\NASA_TILES\` contents
2. Run scan script again

### Backup

Backup these locations:

- `E:\NASAimages\` - Original images
- `E:\NASA_TILES\images-metadata.json` - Metadata

Tiles can be regenerated from originals.

## Example Workflow

### Adding "Tapestry of Blazing Starbirth"

1. **Place TIFF in source folder:**

   ```
   E:\NASAimages\heic2007a.tif
   ```

2. **Generate tiles:**

   ```bash
   node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
   ```

3. **Wait for completion:**

   ```
   ✅ Tile generation complete!
   ⏱️  Duration: 45.2 seconds
   🎯 Total tiles generated: 3,456
   ```

4. **Customize name (optional):**
   Edit `E:\NASA_TILES\images-metadata.json`:

   ```json
   {
     "id": "heic2007a",
     "name": "Tapestry of Blazing Starbirth",
     ...
   }
   ```

5. **View on dashboard:**
   - Refresh `http://localhost:3000/dashboard`
   - Click the image card
   - Explore with zoom and annotations!

## Summary

✅ **Automatic scanning** - Just add images to `E:\NASAimages\`
✅ **TIFF support** - Works with your TIFF files
✅ **Custom storage** - Tiles in `E:\NASA_TILES\`
✅ **Dynamic dashboard** - Images appear automatically
✅ **Easy to add more** - Run scan script anytime

**Ready to use! Add your images and run the scan script!** 🚀
