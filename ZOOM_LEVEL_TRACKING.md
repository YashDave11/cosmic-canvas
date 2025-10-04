# Zoom Level Tracking for Annotations

## Overview

Implemented zoom level tracking for annotations to ensure PDF snippets are captured at the exact zoom level where the annotation was created, keeping the annotation point centered.

## Changes Made

### 1. Annotation Storage (`lib/annotations.ts`)

- Already had `zoomLevel?: number` field in the `Annotation` interface
- The `addAnnotation` function already accepts `zoomLevel` as an optional parameter

### 2. Annotation Creation (`app/viewer/[imageId]/page.tsx`)

- **Updated**: Right-click handler now captures current zoom level when creating annotation
- Passes `viewer.viewport.getZoom()` to `addAnnotation()`
- Logs zoom level in console for debugging

```typescript
const currentZoom = newViewer.viewport.getZoom();
const newAnnotation = addAnnotation(
  imageId,
  viewportPoint.x,
  viewportPoint.y,
  "",
  "#3b82f6",
  currentZoom // Store zoom level at creation
);
```

### 3. PDF Export (`lib/export-annotations-pdf.ts`)

#### Snippet Capture Logic

- **Updated**: Uses stored `annotation.zoomLevel` instead of fixed calculation
- Falls back to `maxZoom * 0.3` if zoom level not stored (backward compatibility)
- Added verification to ensure viewport is at correct zoom and center before capture
- Added recursive re-centering if viewport drifts

```typescript
const targetZoom = annotation.zoomLevel || viewer.viewport.getMaxZoom() * 0.3;
viewer.viewport.zoomTo(targetZoom, viewportPoint, false);
```

#### PDF Output

- **Added**: Zoom level information in annotation details section
- Displays as "Zoom Level: X.XXXXx" if available
- Positioned before timestamp for logical flow

## How It Works

1. **Creation**: When user right-clicks to create annotation, current zoom level is captured and stored
2. **Storage**: Zoom level saved in localStorage along with other annotation data
3. **Export**: When generating PDF, viewer zooms to stored level before capturing snippet
4. **Centering**: Annotation coordinates used as center point for both pan and zoom operations
5. **Verification**: System checks viewport position/zoom and re-applies if needed

## Benefits

- **Consistent Context**: Snippets show same level of detail as when annotation was created
- **Accurate Centering**: Annotation point always at center of snippet
- **User Intent**: Preserves the zoom level user found meaningful
- **Backward Compatible**: Works with existing annotations (uses fallback zoom)

## Testing Checklist

- [ ] Create annotation at low zoom (zoomed out) - snippet should show wide area
- [ ] Create annotation at high zoom (zoomed in) - snippet should show detailed area
- [ ] Create annotation at medium zoom - snippet should match that level
- [ ] Export PDF and verify all snippets have annotation centered
- [ ] Check PDF shows zoom level in annotation details
- [ ] Verify existing annotations (without zoom level) still work

## Technical Notes

- Zoom level stored as floating point number (e.g., 2.5432)
- Viewport coordinates remain in 0-1 range (normalized)
- Canvas capture always 500x500px, but represents different image areas based on zoom
- Crosshair drawn at snippet center to mark annotation point
