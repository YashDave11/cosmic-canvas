dd# 🌌 Cosmic Canvas - Technical Flow & Architecture

## System Overview

Cosmic Canvas is a deep zoom image viewer for ultra-high-resolution astronomical images. The system uses a tile-based approach to handle gigapixel images efficiently.

---

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. Landing Page (/)
   │
   ├─> View NASA Logo & Hero Section
   ├─> Read Features & Technology Info
   └─> Click "Begin Exploration" Button
       │
       ▼
2. Dashboard (/dashboard)
   │
   ├─> API Call: GET /api/images
   │   │
   │   ├─> Load External Images (E:\NASA_TILES\images-metadata.json)
   │   └─> Load Local Images (public/tiles/*.dzi)
   │
   ├─> Display Image Gallery (9 images)
   ├─> Search/Filter Images
   └─> Click Image Card
       │
       ▼
3. Viewer Page (/viewer/[imageId])
   │
   ├─> Load OpenSeadragon Library
   ├─> Initialize Viewer with DZI URL
   ├─> Request Tiles: GET /api/tiles/[imageId]/[level]/[x]_[y].jpg
   │   │
   │   ├─> Check if External (E:\NASA_TILES\)
   │   └─> Check if Local (public/tiles\)
   │
   ├─> User Interactions:
   │   ├─> Pan & Zoom
   │   ├─> Rotate Image
   │   ├─> Right-Click → Create Annotation
   │   ├─> Click Pin → Edit Annotation
   │   ├─> Search by Coordinates
   │   └─> Export to PDF
   │
   └─> Annotations Stored in localStorage
```

---

## 📊 Detailed Component Flow

### 1. Image Tile Generation Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    TILE GENERATION PROCESS                        │
└──────────────────────────────────────────────────────────────────┘

Source Image (TIFF/JPG)
    │
    ├─> Located in: E:\NASAimages\
    │
    ▼
Node.js Script: scripts/scan-and-generate-tiles.js
    │
    ├─> Scan Directory for Images
    ├─> For Each Image:
    │   │
    │   ├─> Create Output Directory: E:\NASA_TILES\[imageId]\
    │   │
    │   ├─> Generate Deep Zoom Tiles
    │   │   ├─> Use Sharp Library
    │   │   ├─> Create Pyramid Levels (0 to N)
    │   │   ├─> Split into 256×256 Tiles
    │   │   └─> Save as JPEG (quality: 90)
    │   │
    │   ├─> Generate DZI Descriptor File
    │   │   └─> [imageId].dzi (XML format)
    │   │
    │   └─> Generate Thumbnail
    │       └─> [imageId]_thumb.jpg (400×300)
    │
    └─> Update Metadata File
        └─> E:\NASA_TILES\images-metadata.json
            ├─> id, name, file
            ├─> width, height, format
            ├─> levels, generatedAt
            └─> dziPath, thumbnailPath

Result: Tiled Image Ready for Viewing
```

### 2. Image Loading Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      IMAGE LOADING FLOW                           │
└──────────────────────────────────────────────────────────────────┘

Dashboard Component
    │
    ├─> useEffect() on Mount
    │
    ▼
API Request: GET /api/images
    │
    ├─> Read: E:\NASA_TILES\images-metadata.json
    │   └─> Parse 8 External Images
    │
    ├─> Check: public/tiles/*.dzi
    │   └─> Add 1 Local Image (andromeda-galaxy)
    │
    └─> Return JSON Response
        {
          success: true,
          count: 9,
          images: [
            {
              id: "heic1502a",
              name: "Sharpest ever view of the Andromeda Galaxy",
              dziUrl: "/api/tiles/heic1502a/heic1502a.dzi",
              thumbnailUrl: "/api/tiles/heic1502a/heic1502a_thumb.jpg",
              description: "40000×12788 pixels",
              size: "512 MP",
              levels: 16
            },
            ...
          ]
        }
    │
    ▼
Dashboard State Updated
    │
    └─> Render Image Gallery
        ├─> Display Thumbnails
        ├─> Show Image Names
        └─> Enable Search/Filter
```

### 3. Viewer Initialization Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    VIEWER INITIALIZATION                          │
└──────────────────────────────────────────────────────────────────┘

User Clicks Image
    │
    ├─> Navigate to: /viewer/[imageId]?dziUrl=...&name=...
    │
    ▼
Viewer Page Component
    │
    ├─> Extract URL Parameters
    │   ├─> imageId (e.g., "heic1502a")
    │   ├─> dziUrl (e.g., "/api/tiles/heic1502a/heic1502a.dzi")
    │   └─> name (e.g., "Sharpest ever view...")
    │
    ├─> Load OpenSeadragon Library
    │   └─> CDN: openseadragon@4.1.0
    │
    ├─> Initialize Viewer
    │   ├─> Create Viewer Instance
    │   ├─> Set tileSources: dziUrl
    │   ├─> Configure Options:
    │   │   ├─> minZoomLevel: 0.5
    │   │   ├─> maxZoomLevel: 20
    │   │   ├─> springStiffness: 6.5
    │   │   └─> backgroundColor: #000000
    │   │
    │   └─> Add Event Handlers:
    │       ├─> "open" → Image Loaded
    │       ├─> "canvas-contextmenu" → Create Annotation
    │       ├─> "animation" → Update Pin Positions
    │       └─> "tile-loaded" → Track Loading
    │
    ├─> Load Existing Annotations
    │   └─> From localStorage: "cosmic-canvas-annotations"
    │
    └─> Render UI Components
        ├─> Control Panel (bottom)
        ├─> Annotation Overlay
        ├─> Annotation List Sidebar
        └─> Coordinate Search Modal
```

### 4. Tile Serving Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       TILE SERVING FLOW                           │
└──────────────────────────────────────────────────────────────────┘

OpenSeadragon Requests Tile
    │
    ├─> URL: /api/tiles/[imageId]/[level]/[x]_[y].jpg
    │   Example: /api/tiles/heic1502a/12/5_3.jpg
    │
    ▼
API Route: /api/tiles/[imageId]/[...path]/route.ts
    │
    ├─> Parse Request
    │   ├─> imageId: "heic1502a"
    │   ├─> path: ["12", "5_3.jpg"]
    │   └─> Determine File Type (DZI or Tile)
    │
    ├─> Check External Storage
    │   ├─> Path: E:\NASA_TILES\[imageId]\[path]
    │   └─> If Exists → Serve File
    │
    ├─> Check Local Storage (Fallback)
    │   ├─> Path: public/tiles/[imageId]_files/[path]
    │   └─> If Exists → Serve File
    │
    └─> Return Response
        ├─> Success: Stream File with Correct MIME Type
        └─> Error: 404 Not Found

OpenSeadragon Receives Tile
    │
    └─> Render Tile on Canvas
        └─> Repeat for All Visible Tiles
```

### 5. Annotation System Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     ANNOTATION SYSTEM FLOW                        │
└──────────────────────────────────────────────────────────────────┘

CREATE ANNOTATION
    │
    User Right-Clicks on Image
    │
    ├─> Event: "canvas-contextmenu"
    │
    ├─> Get Click Position
    │   ├─> Pixel Coordinates (e.g., 1024, 768)
    │   └─> Convert to Viewport Coordinates (0-1 range)
    │       Example: (0.512, 0.384)
    │
    ├─> Capture Current Zoom Level
    │   └─> viewer.viewport.getZoom() → 2.5432
    │
    ├─> Create Annotation Object
    │   {
    │     id: "annotation-1234567890-abc123",
    │     imageId: "heic1502a",
    │     x: 0.512,
    │     y: 0.384,
    │     text: "",
    │     timestamp: 1696435200000,
    │     color: "#3b82f6",
    │     zoomLevel: 2.5432
    │   }
    │
    ├─> Save to localStorage
    │   └─> Key: "cosmic-canvas-annotations"
    │       {
    │         "heic1502a": [annotation1, annotation2, ...],
    │         "heic0910i": [annotation3, ...]
    │       }
    │
    └─> Update UI
        ├─> Add Pin to Overlay
        └─> Open Edit Popup

DISPLAY ANNOTATIONS
    │
    ├─> Load Annotations from localStorage
    │
    ├─> For Each Annotation:
    │   │
    │   ├─> Convert Viewport Coords to Pixel Coords
    │   │   └─> viewer.viewport.viewportToViewerElementCoordinates()
    │   │
    │   ├─> Position Pin at Pixel Location
    │   │   └─> CSS: position: absolute; left: Xpx; top: Ypx
    │   │
    │   └─> Update on Viewport Changes
    │       ├─> Pan → Recalculate Position
    │       ├─> Zoom → Recalculate Position
    │       └─> Rotate → Recalculate Position
    │
    └─> Render Annotation List Sidebar
        └─> Show All Annotations with Actions

EDIT/DELETE ANNOTATION
    │
    ├─> Click Pin or List Item
    │
    ├─> Open Popup/Modal
    │   ├─> Show Current Text
    │   └─> Provide Edit/Delete Buttons
    │
    ├─> User Edits Text
    │   └─> Update in localStorage
    │
    └─> User Deletes
        └─> Remove from localStorage & UI
```

### 6. PDF Export Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       PDF EXPORT FLOW                             │
└──────────────────────────────────────────────────────────────────┘

User Clicks "Export PDF"
    │
    ├─> Call: exportAnnotationsToPDF()
    │
    ▼
For Each Annotation:
    │
    ├─> Set Viewer Zoom to Stored Level
    │   └─> viewer.viewport.zoomTo(annotation.zoomLevel)
    │
    ├─> Wait for Tiles to Load
    │   └─> Listen to "tile-loaded" events
    │
    ├─> Capture Canvas Snippet
    │   │
    │   ├─> Get Annotation Pixel Position
    │   │   └─> viewportToViewerElementCoordinates()
    │   │
    │   ├─> Calculate Crop Area (500×500px)
    │   │   ├─> sourceX = pixelX - 250
    │   │   └─> sourceY = pixelY - 250
    │   │
    │   ├─> Draw to New Canvas
    │   │   └─> ctx.drawImage(canvas, sourceX, sourceY, 500, 500, 0, 0, 500, 500)
    │   │
    │   └─> Add Crosshair at Center
    │       └─> Mark Annotation Position
    │
    ├─> Convert to Data URL
    │   └─> canvas.toDataURL("image/png")
    │
    └─> Add to PDF Page
        ├─> Title: Annotation Text
        ├─> Image: Snippet (140×140mm)
        ├─> Details:
        │   ├─> Coordinates (X, Y)
        │   ├─> Zoom Level
        │   ├─> Timestamp
        │   └─> Color
        │
        └─> Next Page

Generate PDF
    │
    ├─> Title Page
    │   ├─> "Annotation Report"
    │   ├─> Image Name
    │   ├─> Generation Date
    │   └─> Total Count
    │
    ├─> Annotation Pages (1 per annotation)
    │
    └─> Save File
        └─> annotations-[imagename]-[date].pdf
```

### 7. Coordinate Search Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                   COORDINATE SEARCH FLOW                          │
└──────────────────────────────────────────────────────────────────┘

User Clicks Info Button (i)
    │
    └─> Open Coordinate Search Modal

User Enters Coordinates
    │
    ├─> X: 0.270560
    └─> Y: 0.058141

User Clicks "Navigate"
    │
    ├─> Validate Input
    │   ├─> Check if Valid Numbers
    │   ├─> Check Range (0-1)
    │   └─> Show Error if Invalid
    │
    ├─> Create Viewport Point
    │   └─> new OpenSeadragon.Point(x, y)
    │
    ├─> Pan to Point
    │   └─> viewer.viewport.panTo(point, true)
    │
    ├─> Zoom to Target Level
    │   └─> viewer.viewport.zoomTo(maxZoom * 0.4, point, true)
    │
    └─> Close Modal
        └─> User Sees Location
```

---

## 🗂️ Data Storage Architecture

### localStorage Structure

```javascript
// Annotations Storage
{
  "cosmic-canvas-annotations": {
    "heic1502a": [
      {
        id: "annotation-1696435200000-abc123",
        imageId: "heic1502a",
        x: 0.512,
        y: 0.384,
        text: "Interesting star cluster",
        timestamp: 1696435200000,
        color: "#3b82f6",
        zoomLevel: 2.5432
      }
    ],
    "heic0910i": [...]
  }
}
```

### File System Structure

```
E:\NASA_TILES\
├── images-metadata.json          # Master index of all images
├── heic1502a\
│   ├── heic1502a.dzi            # Deep Zoom descriptor
│   ├── heic1502a_thumb.jpg      # Thumbnail
│   └── heic1502a_files\
│       ├── 0\                    # Zoom level 0 (lowest)
│       │   └── 0_0.jpg
│       ├── 1\
│       │   ├── 0_0.jpg
│       │   └── 1_0.jpg
│       ├── ...
│       └── 16\                   # Zoom level 16 (highest)
│           ├── 0_0.jpg
│           ├── 0_1.jpg
│           └── ...
└── heic0910i\
    └── ...

public\tiles\
└── andromeda-galaxy_files\
    └── [similar structure]
```

---

## 🔧 Technology Stack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

Frontend Layer
    │
    ├─> Next.js 15 (App Router)
    │   ├─> React 18 Components
    │   ├─> TypeScript
    │   └─> Tailwind CSS
    │
    ├─> OpenSeadragon 4.1.0
    │   ├─> Deep Zoom Viewer
    │   ├─> Tile Management
    │   └─> Viewport Controls
    │
    └─> UI Libraries
        ├─> Lucide Icons
        ├─> jsPDF (PDF Export)
        └─> Geist Font

Backend Layer (API Routes)
    │
    ├─> Next.js API Routes
    │   ├─> /api/images
    │   └─> /api/tiles/[imageId]/[...path]
    │
    └─> Node.js File System
        ├─> fs (File Operations)
        └─> path (Path Resolution)

Build Tools
    │
    ├─> Sharp (Image Processing)
    │   ├─> Tile Generation
    │   ├─> Thumbnail Creation
    │   └─> Format Conversion
    │
    └─> Node.js Scripts
        └─> Tile Generation Pipeline

Deployment
    │
    └─> Vercel / Custom Server
        ├─> Static Assets (public/)
        ├─> API Routes (serverless)
        └─> External Storage (E:\NASA_TILES\)
```

---

## 🚀 Performance Optimizations

### 1. Tile Loading Strategy

- **Progressive Loading**: Load low-res tiles first, then high-res
- **Viewport Culling**: Only load visible tiles
- **Tile Caching**: Browser caches tiles automatically
- **Preloading**: Adjacent tiles preloaded for smooth panning

### 2. Memory Management

- **Tile Disposal**: Old tiles removed from memory
- **Canvas Optimization**: Hardware-accelerated rendering
- **Lazy Loading**: Images loaded on-demand

### 3. Network Optimization

- **Tile Compression**: JPEG quality 90 (balance size/quality)
- **HTTP Caching**: Tiles cached with long expiry
- **Parallel Requests**: Multiple tiles loaded simultaneously

---

## 🔐 Security Considerations

1. **Path Traversal Prevention**: Validate all file paths
2. **Input Sanitization**: Validate annotation text
3. **CORS Configuration**: Restrict API access
4. **File Type Validation**: Only serve allowed file types
5. **Rate Limiting**: Prevent API abuse (future enhancement)

---

## 📈 Scalability

### Current Capacity

- **Images**: Unlimited (file system based)
- **Image Size**: Up to 512 MP tested (40,000×12,788)
- **Annotations**: Unlimited per image (localStorage)
- **Concurrent Users**: Depends on server capacity

### Future Enhancements

- Database for annotations (PostgreSQL/MongoDB)
- CDN for tile serving (CloudFront/Cloudflare)
- User authentication & multi-user support
- Real-time collaboration on annotations
- Cloud storage integration (S3/Azure Blob)

---

## 🐛 Error Handling Flow

```
Error Occurs
    │
    ├─> Tile Load Failed
    │   └─> Log Error → Continue Loading Other Tiles
    │
    ├─> API Request Failed
    │   └─> Show Error Message → Retry Button
    │
    ├─> Annotation Save Failed
    │   └─> Show Toast → Retry Save
    │
    └─> Viewer Init Failed
        └─> Show Error Page → Back to Dashboard
```

---

## 📝 Summary

Cosmic Canvas uses a **tile-based architecture** to handle ultra-high-resolution images efficiently:

1. **Images are pre-processed** into tile pyramids
2. **Tiles are served on-demand** based on viewport
3. **Annotations are stored locally** with viewport coordinates
4. **PDF export captures** exact zoom context
5. **Coordinate search** enables precise navigation

This architecture enables smooth exploration of gigapixel images with minimal memory usage and fast loading times.
