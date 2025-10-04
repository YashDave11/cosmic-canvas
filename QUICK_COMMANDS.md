# ⚡ Quick Commands Reference

## Generate Tiles for All Images

```bash
node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
```

## Generate Tiles for Single Image

```bash
node scripts/generate-tiles-custom.js E:\NASAimages\heic2007a.tif E:\NASA_TILES heic2007a
```

## Start Development Server

```bash
npm run dev
```

## View Dashboard

```
http://localhost:3000/dashboard
```

## Check API Response

```
http://localhost:3000/api/images
```

## For Large Files (>500MB)

```bash
node --max-old-space-size=8192 scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
```

---

## File Locations

- **Source Images:** `E:\NASAimages\`
- **Generated Tiles:** `E:\NASA_TILES\`
- **Metadata:** `E:\NASA_TILES\images-metadata.json`

---

## Workflow

1. Add images to `E:\NASAimages\`
2. Run: `node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES`
3. Start: `npm run dev`
4. Open: `http://localhost:3000/dashboard`
5. Done! 🎉
