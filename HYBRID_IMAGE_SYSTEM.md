# 🔄 Hybrid Image System

## Overview

The system now supports **both** local and external tile sources:

1. **Local Images** - Stored in `public/tiles/` (legacy system)
2. **External Images** - Stored in `E:\NASA_TILES\` (new system)

## How It Works

### API Endpoint: `/api/images`

The API now combines images from both sources:

```typescript
// 1. Load external images from E:\NASA_TILES\images-metadata.json
// 2. Add legacy local images from public/tiles/
// 3. Return combined list
```

### Image Sources

**Local Images (Legacy):**

- Location: `public/tiles/`
- DZI URL: `/tiles/andromeda-galaxy.dzi`
- Thumbnail: `/spiral-galaxy-deep-space.jpg`
- Served by: Next.js static file serving
- Example: Andromeda Galaxy (M31)

**External Images (New):**

- Location: `E:\NASA_TILES\[image-name]\`
- DZI URL: `/api/tiles/[image-name]/[image-name].dzi`
- Thumbnail: `/api/tiles/[image-name]/[image-name]_thumb.jpg`
- Served by: Custom API route
- Example: heic2007a (Tapestry of Blazing Starbirth)

## Current Images

### 1. Andromeda Galaxy (M31)

- **Source:** Local (`public/tiles/`)
- **Format:** JPEG tiles
- **Size:** 42,208×9,870 pixels (417 MP)
- **Zoom Levels:** 17
- **Status:** ✅ Restored

### 2. heic2007a (Tapestry of Blazing Starbirth)

- **Source:** External (`E:\NASA_TILES\heic2007a\`)
- **Format:** TIFF → JPEG tiles
- **Size:** 17,043×11,710 pixels (200 MP)
- **Zoom Levels:** 15
- **Status:** ✅ Active

## Adding More Images

### Add Local Image (Legacy Method)

1. Generate tiles to `public/tiles/`
2. Add entry to legacy images array in `app/api/images/route.ts`

### Add External Image (New Method)

1. Place image in `E:\NASAimages\`
2. Run: `node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES`
3. Automatically appears on dashboard

## Benefits

✅ **Backward Compatible** - Old images still work
✅ **Flexible** - Support both local and external storage
✅ **Scalable** - External storage for large collections
✅ **Easy Migration** - Can move images gradually

## File Structure

```
Project/
├── public/
│   └── tiles/                    # Local tiles (legacy)
│       ├── andromeda-galaxy.dzi
│       └── andromeda-galaxy_files/
│
└── E:\NASA_TILES/                # External tiles (new)
    ├── heic2007a/
    │   ├── heic2007a.dzi
    │   ├── heic2007a_files/
    │   └── heic2007a_thumb.jpg
    └── images-metadata.json
```

## API Response Example

```json
{
  "success": true,
  "count": 2,
  "images": [
    {
      "id": "heic2007a",
      "name": "heic2007a",
      "dziUrl": "/api/tiles/heic2007a/heic2007a.dzi",
      "source": "external"
    },
    {
      "id": "andromeda-galaxy",
      "name": "Andromeda Galaxy (M31)",
      "dziUrl": "/tiles/andromeda-galaxy.dzi",
      "source": "local"
    }
  ]
}
```

## Migration Path

To move local images to external storage:

1. Copy tiles from `public/tiles/[name]/` to `E:\NASA_TILES\[name]/`
2. Add entry to `E:\NASA_TILES\images-metadata.json`
3. Remove from legacy images array in API
4. Test and verify

## Summary

✅ **Andromeda Galaxy restored** - Shows on dashboard
✅ **New TIFF system intact** - heic2007a still works
✅ **Both systems coexist** - No conflicts
✅ **Easy to add more** - Use either method

**Both images now appear on the dashboard!** 🎉
