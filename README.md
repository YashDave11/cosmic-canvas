# 🌌 Cosmic Canvas - Deep Zoom Image Viewer

A professional-grade web application for exploring ultra-high-resolution astronomical images with seamless zoom, pan, and annotation capabilities. Built with Next.js 15 and OpenSeadragon, supporting images up to gigapixels in size.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features

- **🔍 Deep Zoom Technology** - Explore gigapixel images with smooth, Google Maps-like zooming
- **🖼️ Multi-Format Support** - TIFF, JPEG, PNG, WebP images
- **📌 Annotation System** - Right-click to add, edit, and manage annotations
- **📋 Annotation List** - Sidebar with all annotations, click to zoom to location
- **🎨 Modern UI** - Glass morphism design with dark space theme
- **⚡ High Performance** - Tile-based rendering for instant loading
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **⌨️ Keyboard Shortcuts** - Power user features for quick navigation
- **💾 Persistent Storage** - Annotations saved in localStorage
- **🌐 AWS Integration** - Optional CloudFront CDN for global delivery

### Advanced Features

- **Automatic Tile Generation** - Convert large images to Deep Zoom format
- **Dynamic Image Loading** - Auto-scan directories for new images
- **Thumbnail Generation** - Automatic preview images for dashboard
- **Metadata Management** - Track image dimensions, format, zoom levels
- **Click-to-Zoom Navigation** - Jump to annotations from list
- **Fullscreen Mode** - Immersive viewing experience
- **Image Rotation** - Rotate images 90° left or right
- **Custom Controls** - Modern floating control panel

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15.2.4](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS
- **[OpenSeadragon 4.1.0](https://openseadragon.github.io/)** - Deep zoom viewer
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Shadcn/ui](https://ui.shadcn.com/)** - Component library

### Backend

- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Sharp](https://sharp.pixelplumbing.co.uk/)** - High-performance image processing

### Infrastructure

- **[Vercel](https://vercel.com/)** - Deployment platform (optional)
- **[AWS S3](https://aws.amazon.com/s3/)** - Cloud storage (optional)
- **[AWS CloudFront](https://aws.amazon.com/cloudfront/)** - CDN (optional)

### Development Tools

- **[pnpm](https://pnpm.io/)** - Fast package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │    Viewer    │  │ Annotations  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │  Components  │  │    Pages     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Tile Files  │  │   Metadata   │  │ localStorage │      │
│  │  (E:\NASA_   │  │    (JSON)    │  │(Annotations) │      │
│  │   TILES)     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
App
├── Dashboard Page
│   ├── Navigation
│   ├── TileImageSearch
│   │   ├── Search Input
│   │   ├── Image Cards
│   │   └── Scan Button
│   └── Empty State
│
└── Viewer Page
    ├── OpenSeadragon Container
    ├── AnnotationOverlay
    │   └── AnnotationPins
    ├── AnnotationList (Sidebar)
    │   ├── List Items
    │   └── Actions (Edit/Delete)
    ├── AnnotationPopup (Modal)
    │   ├── Text Input
    │   └── Save/Delete Buttons
    ├── ControlPanel (Floating)
    │   ├── Zoom Controls
    │   ├── Rotation Controls
    │   └── Fullscreen Toggle
    └── Instructions Overlay
```

### Data Flow

```
1. Image Addition
   User adds TIFF → Script generates tiles → Metadata saved → API serves data

2. Image Viewing
   Dashboard loads → API fetches images → User clicks → Viewer opens → OpenSeadragon loads tiles

3. Annotation Creation
   User right-clicks → Popup opens → User names → Saved to localStorage → Pin appears

4. Annotation Navigation
   User opens list → Clicks annotation → Viewer zooms to location
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** (or npm/yarn)
- **Windows** (paths configured for Windows, adaptable for Linux/Mac)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cosmic-canvas.git
   cd cosmic-canvas
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up directories**

   ```bash
   # Create source images directory
   mkdir E:\NASAimages

   # Create tiles output directory
   mkdir E:\NASA_TILES
   ```

4. **Add your images**

   - Place TIFF, JPG, or PNG files in `E:\NASAimages\`

5. **Generate tiles**

   ```bash
   node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
   ```

6. **Start development server**

   ```bash
   pnpm dev
   ```

7. **Open browser**
   ```
   http://localhost:3000/dashboard
   ```

### Quick Start Commands

```bash
# Install dependencies
pnpm install

# Generate tiles for all images
node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES

# Generate tiles for single image
node scripts/generate-tiles-custom.js E:\NASAimages\image.tif E:\NASA_TILES image-name

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📖 Usage

### Adding Images

1. **Place images** in `E:\NASAimages\`
2. **Run tile generation:**
   ```bash
   node scripts/scan-and-generate-tiles.js E:\NASAimages E:\NASA_TILES
   ```
3. **Refresh dashboard** - Images appear automatically

### Viewing Images

1. **Open dashboard:** `http://localhost:3000/dashboard`
2. **Click image card** - Opens in full-screen viewer
3. **Use controls:**
   - Drag to pan
   - Scroll to zoom
   - Use floating control panel for more options

### Creating Annotations

1. **Right-click** anywhere on the image
2. **Type annotation name** in popup
3. **Click Save** or press `Ctrl+Enter`
4. **Pin appears** at clicked location

### Managing Annotations

1. **Open list** - Click button in top-right corner
2. **Navigate** - Click annotation to zoom to it
3. **Edit** - Click → button or click pin directly
4. **Delete** - Click 🗑️ button

### Keyboard Shortcuts

| Key          | Action                     |
| ------------ | -------------------------- |
| `+`          | Zoom in                    |
| `-`          | Zoom out                   |
| `0`          | Reset view                 |
| `R`          | Rotate right               |
| `Shift+R`    | Rotate left                |
| `F`          | Toggle fullscreen          |
| `A`          | Toggle annotation pins     |
| `Esc`        | Close popup                |
| `Ctrl+Enter` | Save annotation (in popup) |
| `Backspace`  | Back to dashboard          |

## 📁 Project Structure

```
cosmic-canvas/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── images/              # Images list endpoint
│   │   │   └── route.ts
│   │   └── tiles/               # Tile serving endpoint
│   │       └── [imageId]/[...path]/
│   │           └── route.ts
│   ├── dashboard/               # Dashboard page
│   │   └── page.tsx
│   ├── viewer/                  # Viewer page
│   │   └── [imageId]/
│   │       └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                   # React components
│   ├── dashboard/
│   │   └── tile-image-search.tsx
│   ├── viewer/
│   │   ├── annotation-list.tsx
│   │   ├── annotation-overlay.tsx
│   │   ├── annotation-pin.tsx
│   │   ├── annotation-popup.tsx
│   │   └── control-panel.tsx
│   ├── ui/                      # Shadcn/ui components
│   ├── navigation.tsx
│   └── starfield.tsx
│
├── lib/                         # Utility functions
│   ├── annotations.ts           # Annotation storage
│   └── utils.ts                 # Helper functions
│
├── scripts/                     # Build scripts
│   ├── generate-tiles.js        # Original tile generator
│   ├── generate-tiles-custom.js # Custom tile generator
│   └── scan-and-generate-tiles.js # Auto-scan script
│
├── public/                      # Static assets
│   ├── tiles/                   # Local tiles (optional)
│   └── images/                  # Static images
│
├── docs/                        # Documentation
│   ├── AWS_TILES_ONLY_GUIDE.md
│   ├── ANNOTATION_USAGE_GUIDE.md
│   ├── TIFF_IMAGES_SETUP_GUIDE.md
│   └── ...
│
├── .kiro/                       # Kiro IDE specs
│   └── specs/
│       └── image-viewer-improvements/
│
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔧 How It Works

### Tile Generation Process

1. **Input:** Large image (TIFF, JPG, PNG, WebP)
2. **Processing:**
   - Sharp reads image metadata
   - Image split into 512×512 pixel tiles
   - Multiple zoom levels created (pyramid structure)
   - DZI manifest file generated
   - Thumbnail created
3. **Output:**
   - `image.dzi` - Deep Zoom Image manifest (XML)
   - `image_files/` - Folder with tile pyramid
   - `image_thumb.jpg` - Thumbnail for dashboard
   - Metadata entry in `images-metadata.json`

### Deep Zoom Technology

**Pyramid Structure:**

```
Level 0: 1 tile (512×512) - Full image overview
Level 1: 4 tiles - 2× zoom
Level 2: 16 tiles - 4× zoom
Level 3: 64 tiles - 8× zoom
...
Level N: Thousands of tiles - Maximum detail
```

**Benefits:**

- Only loads visible tiles
- Smooth zooming experience
- Handles gigapixel images
- Minimal bandwidth usage

### Annotation System

**Storage:**

```javascript
localStorage["cosmic-canvas-annotations"] = {
  "image-id": [
    {
      id: "annotation-123",
      x: 0.5, // Viewport coordinates (0-1)
      y: 0.3,
      text: "Interesting feature",
      timestamp: 1704412800000,
      color: "#3b82f6",
    },
  ],
};
```

**Coordinate System:**

- Annotations stored in viewport coordinates (0-1 range)
- Converted to pixel coordinates for display
- Updates in real-time during zoom/pan
- Stays anchored to image features

### API Endpoints

**GET /api/images**

- Returns list of available images
- Reads `images-metadata.json`
- Transforms data for frontend

**GET /api/tiles/[imageId]/[...path]**

- Serves DZI files and tile images
- Handles caching headers
- Security checks for path traversal
- Content-type detection

## 📚 API Documentation

### GET /api/images

Returns list of all available images.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "images": [
    {
      "id": "heic2007a",
      "name": "Tapestry of Blazing Starbirth",
      "dziUrl": "/api/tiles/heic2007a/heic2007a.dzi",
      "thumbnailUrl": "/api/tiles/heic2007a/heic2007a_thumb.jpg",
      "description": "17043×11710 pixels",
      "size": "200 MP",
      "levels": 15,
      "format": "tiff",
      "generatedAt": "2025-01-04T12:00:00.000Z"
    }
  ]
}
```

### GET /api/tiles/[imageId]/[...path]

Serves tile files and DZI manifests.

**Examples:**

- `/api/tiles/heic2007a/heic2007a.dzi` - DZI manifest
- `/api/tiles/heic2007a/heic2007a_thumb.jpg` - Thumbnail
- `/api/tiles/heic2007a/heic2007a_files/0/0_0.jpg` - Tile

**Headers:**

- `Content-Type`: Appropriate MIME type
- `Cache-Control`: `public, max-age=31536000, immutable`

## ⚙️ Configuration

### Paths Configuration

Edit in API routes:

```typescript
// app/api/images/route.ts
const TILES_DIR = "E:\\NASA_TILES";

// app/api/tiles/[imageId]/[...path]/route.ts
const TILES_DIR = "E:\\NASA_TILES";
```

### Tile Generation Settings

Edit `scripts/generate-tiles-custom.js`:

```javascript
.tile({
  size: 512,        // Tile size (256, 512, 1024)
  overlap: 1,       // Pixel overlap (0-2)
  layout: "dz",     // Deep Zoom layout
  format: "jpeg",   // Format (jpeg, webp, png)
  quality: 85,      // Quality (1-100)
})
```

### Thumbnail Settings

```javascript
.resize(400, 300, {
  fit: "cover",
  position: "center",
})
.jpeg({ quality: 80 })
```

### OpenSeadragon Settings

Edit `app/viewer/[imageId]/page.tsx`:

```javascript
window.OpenSeadragon({
  minZoomLevel: 0.5, // Minimum zoom
  maxZoomLevel: 20, // Maximum zoom
  springStiffness: 6.5, // Animation speed
  animationTime: 1.0, // Animation duration
  // ... more options
});
```

## 🚀 Performance

### Optimization Techniques

1. **Tile-based Loading**

   - Only loads visible tiles
   - Progressive loading
   - Lazy loading for off-screen content

2. **Caching Strategy**

   - Immutable cache headers (1 year)
   - Browser caching
   - CDN caching (if using CloudFront)

3. **Image Optimization**

   - JPEG compression (85% quality)
   - Optimal tile size (512×512)
   - Thumbnail generation

4. **Code Optimization**
   - React memoization
   - Efficient re-renders
   - Debounced operations

### Performance Metrics

**Target Metrics:**

- Initial page load: < 2s
- Time to interactive: < 3s
- Tile load time: < 100ms
- Annotation creation: < 200ms
- Smooth 60fps animations

**Actual Performance:**

- 17043×11710 pixel image (200MP)
- 1,073 tiles generated
- Tile generation: ~8 seconds
- Viewer load: < 1 second
- Smooth zoom/pan at 60fps

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel**

   - Import project in Vercel dashboard
   - Configure environment variables
   - Deploy

3. **Configure Tile Storage**
   - Use AWS S3 for tiles
   - Set up CloudFront CDN
   - Update API routes with S3 URLs

### AWS S3 + CloudFront

See `AWS_TILES_ONLY_GUIDE.md` for complete setup.

**Quick Steps:**

1. Create S3 bucket
2. Upload tiles to S3
3. Create CloudFront distribution
4. Update tile URLs in code

### Environment Variables

```env
# Optional: AWS Configuration
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DOMAIN=d123abc.cloudfront.net

# Optional: Custom Paths
TILES_DIRECTORY=E:\NASA_TILES
SOURCE_IMAGES_DIRECTORY=E:\NASAimages
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test on multiple browsers
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[OpenSeadragon](https://openseadragon.github.io/)** - Deep zoom viewer library
- **[Sharp](https://sharp.pixelplumbing.co.uk/)** - Image processing library
- **[Next.js](https://nextjs.org/)** - React framework
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[NASA](https://www.nasa.gov/)** - Astronomical images
- **[Hubble Space Telescope](https://hubblesite.org/)** - Image sources

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** [GitHub Issues](https://github.com/yourusername/cosmic-canvas/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/cosmic-canvas/discussions)

## 🗺️ Roadmap

### Version 1.1

- [ ] User authentication
- [ ] Cloud storage for annotations
- [ ] Annotation sharing
- [ ] Export annotations as JSON/CSV

### Version 1.2

- [ ] Multi-user collaboration
- [ ] Real-time annotation sync
- [ ] Annotation categories/tags
- [ ] Advanced search and filtering

### Version 2.0

- [ ] 3D image support
- [ ] Video annotations
- [ ] AI-powered feature detection
- [ ] Mobile app (React Native)

## 📊 Statistics

- **Lines of Code:** ~5,000+
- **Components:** 15+
- **API Endpoints:** 2
- **Supported Formats:** 4 (TIFF, JPEG, PNG, WebP)
- **Max Image Size:** Unlimited (tested up to 500MP)
- **Tile Generation Speed:** ~8 seconds for 200MP image
- **Browser Support:** Chrome, Firefox, Safari, Edge

---

**Built with ❤️ for exploring the cosmos** 🌌✨

**Star ⭐ this repo if you find it useful!**
