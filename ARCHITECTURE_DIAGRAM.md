# 🏗️ Cosmic Canvas - Deployment Architecture

## Current Setup (Local)

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Computer                            │
│                                                              │
│  ┌──────────────┐         ┌─────────────────────────────┐  │
│  │              │         │                             │  │
│  │  Next.js App │────────▶│  E:\NASA_TILES\             │  │
│  │  (localhost) │         │  • heic0206c\               │  │
│  │              │         │  • heic0503a\               │  │
│  └──────────────┘         │  • heic1502a\               │  │
│                           │  • images-metadata.json     │  │
│                           │                             │  │
│                           └─────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Problem: Can't deploy this to the web!
```

---

## New Setup (Cloud)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           THE INTERNET                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                         User's Browser                       │    │
│  │                                                              │    │
│  │  https://cosmic-canvas.vercel.app                           │    │
│  │                                                              │    │
│  └───────────────────┬──────────────────────┬──────────────────┘    │
│                      │                      │                        │
│                      │                      │                        │
│         ┌────────────▼──────────┐  ┌────────▼─────────────────┐    │
│         │                        │  │                          │    │
│         │   Vercel (FREE)        │  │  Cloudflare R2 (FREE)    │    │
│         │                        │  │                          │    │
│         │  ┌──────────────────┐  │  │  ┌────────────────────┐ │    │
│         │  │                  │  │  │  │                    │ │    │
│         │  │  Next.js App     │  │  │  │  Tiles Storage     │ │    │
│         │  │  • Pages         │  │  │  │  • heic0206c\      │ │    │
│         │  │  • API Routes    │──┼──┼─▶│  • heic0503a\      │ │    │
│         │  │  • Components    │  │  │  │  • heic1502a\      │ │    │
│         │  │                  │  │  │  │  • metadata.json   │ │    │
│         │  └──────────────────┘  │  │  │                    │ │    │
│         │                        │  │  └────────────────────┘ │    │
│         │  Size: ~50MB           │  │  Size: ~1-5GB          │    │
│         │  Bandwidth: 100GB/mo   │  │  Storage: 10GB         │    │
│         │  Cost: FREE            │  │  Bandwidth: UNLIMITED  │    │
│         │                        │  │  Cost: FREE            │    │
│         └────────────────────────┘  └──────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

Solution: Split app and tiles, both hosted for FREE!
```

---

## How It Works

### 1. User Visits Your Site

```
User types: cosmic-canvas.vercel.app
    ↓
Vercel serves the Next.js app
    ↓
User sees landing page
```

### 2. User Opens Dashboard

```
Browser requests: /dashboard
    ↓
Vercel serves dashboard page
    ↓
Dashboard calls: /api/images-r2
    ↓
API fetches: https://pub-xxxxx.r2.dev/images-metadata.json
    ↓
Returns list of images
    ↓
Dashboard displays image gallery
```

### 3. User Clicks an Image

```
Browser navigates to: /viewer/heic1502a
    ↓
Viewer initializes OpenSeadragon
    ↓
OpenSeadragon requests: /api/tiles-r2/heic1502a/heic1502a.dzi
    ↓
API proxies to: https://pub-xxxxx.r2.dev/heic1502a/heic1502a.dzi
    ↓
Returns DZI descriptor
    ↓
OpenSeadragon starts requesting tiles
```

### 4. User Zooms In

```
OpenSeadragon needs tiles for current view
    ↓
Requests: /api/tiles-r2/heic1502a/12/5_3.jpg
    ↓
API proxies to: https://pub-xxxxx.r2.dev/heic1502a/12/5_3.jpg
    ↓
Returns tile image
    ↓
Browser caches tile (won't request again)
    ↓
Viewer displays tile
```

---

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ 1. Request page
       ▼
┌──────────────┐
│    Vercel    │
│  (Next.js)   │
└──────┬───────┘
       │
       │ 2. Request images list
       ▼
┌──────────────┐
│ Cloudflare   │
│     R2       │
│  (Storage)   │
└──────┬───────┘
       │
       │ 3. Return metadata
       ▼
┌──────────────┐
│    Vercel    │
│  (API Route) │
└──────┬───────┘
       │
       │ 4. Return to browser
       ▼
┌──────────────┐
│   Browser    │
│  (Display)   │
└──────────────┘
```

---

## File Structure Comparison

### Before (Local)

```
Your Computer
├── cosmic-canvas/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
└── E:\NASA_TILES\
    ├── images-metadata.json
    ├── heic0206c/
    ├── heic0503a/
    └── ...
```

### After (Cloud)

```
Vercel
└── cosmic-canvas/
    ├── app/
    ├── components/
    ├── public/
    └── ...

Cloudflare R2
└── cosmic-canvas-tiles/
    ├── images-metadata.json
    ├── heic0206c/
    ├── heic0503a/
    └── ...
```

---

## Cost Breakdown

### Monthly Costs

```
┌─────────────────────────────────────────────────────┐
│                   Vercel (FREE)                      │
├─────────────────────────────────────────────────────┤
│ Bandwidth:        100 GB/month        FREE          │
│ Build Time:       6000 minutes/month  FREE          │
│ Deployments:      Unlimited           FREE          │
│ Functions:        100 GB-hours        FREE          │
│                                                      │
│ Total:                                $0.00         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Cloudflare R2 (FREE)                    │
├─────────────────────────────────────────────────────┤
│ Storage:          10 GB               FREE          │
│ Class A Ops:      1M requests/month   FREE          │
│ Class B Ops:      10M requests/month  FREE          │
│ Egress:           UNLIMITED           FREE          │
│                                                      │
│ Total:                                $0.00         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  GRAND TOTAL                         │
│                                                      │
│                    $0.00/month                       │
│                                                      │
│                  FREE FOREVER! ✨                    │
└─────────────────────────────────────────────────────┘
```

---

## Performance Comparison

### Local Hosting

```
Speed:     Fast (local network)
Access:    Only you
Uptime:    When computer is on
Bandwidth: Limited by your internet
Cost:      Electricity
```

### Cloud Hosting (Vercel + R2)

```
Speed:     Fast (global CDN)
Access:    Anyone, anywhere
Uptime:    99.99% (always on)
Bandwidth: Unlimited
Cost:      $0
```

---

## Scalability

### Can Handle:

- ✅ 1 user
- ✅ 100 users
- ✅ 10,000 users
- ✅ 1,000,000 users

### Auto-scales:

- ✅ More traffic → More servers (automatic)
- ✅ Less traffic → Fewer servers (automatic)
- ✅ You pay nothing either way!

---

## Security

### Vercel:

- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Firewall included
- ✅ Automatic security updates

### Cloudflare R2:

- ✅ Encrypted storage
- ✅ DDoS protection
- ✅ Access controls
- ✅ Automatic backups

---

## Maintenance

### What You Do:

- Update code (git push)
- Add new images (upload to R2)

### What's Automatic:

- ✅ Deployments
- ✅ Scaling
- ✅ Backups
- ✅ Security updates
- ✅ SSL certificates
- ✅ CDN distribution

---

## Summary

### Before:

- ❌ Can't share with others
- ❌ Limited to local network
- ❌ Computer must stay on
- ❌ No backups
- ❌ No CDN

### After:

- ✅ Share with anyone
- ✅ Accessible worldwide
- ✅ Always online
- ✅ Automatic backups
- ✅ Global CDN
- ✅ FREE!

---

**This is why cloud hosting is amazing! 🚀**
