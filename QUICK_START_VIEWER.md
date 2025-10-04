# 🚀 Quick Start - Cosmic Canvas Viewer

## 30-Second Start

1. **Start server:** `npm run dev`
2. **Open:** `http://localhost:3000/dashboard`
3. **Click any image** → Opens in full-screen viewer
4. **Double-click** anywhere → Creates annotation

Done! 🎉

---

## 5-Minute Tour

### Step 1: Navigate to Dashboard

```
http://localhost:3000/dashboard
```

### Step 2: Select an Image

- Click on "Andromeda Galaxy (M31)" card
- You'll be redirected to the viewer page

### Step 3: Explore the Viewer

**Pan & Zoom:**

- Drag to move around
- Scroll to zoom in/out
- Double-click to zoom to a point

**Use Controls (Bottom Panel):**

- 🔍 Zoom In/Out
- 🏠 Reset View
- 🔄 Rotate Left/Right
- ⛶ Fullscreen
- 📌 Toggle Annotations

**Create Annotations:**

- Double-click anywhere on the image
- A pin appears
- Click the pin to add text
- Save your note

### Step 4: Keyboard Shortcuts

| Key       | Action             |
| --------- | ------------------ |
| `+`       | Zoom in            |
| `-`       | Zoom out           |
| `0`       | Reset view         |
| `R`       | Rotate right       |
| `Shift+R` | Rotate left        |
| `F`       | Fullscreen         |
| `A`       | Toggle annotations |
| `Esc`     | Close popup        |

---

## Common Tasks

### Add an Annotation

1. Double-click on the image
2. A pin appears with default text
3. Click the pin to edit
4. Type your note
5. Click "Save" or press Ctrl+Enter

### Edit an Annotation

1. Click any pin
2. Edit the text
3. Click "Save"

### Delete an Annotation

1. Click the pin
2. Click "Delete" button
3. Confirm deletion

### Toggle Annotations On/Off

- Click "Annotations (X)" button in control panel
- Or press `A` key

### Go Back to Dashboard

- Click "Dashboard" button (top-left)
- Or press `Backspace`

---

## Tips & Tricks

### 💡 Pro Tips

1. **Smooth Zooming**

   - Hold Shift while scrolling for slower zoom
   - Double-click to zoom to that point

2. **Quick Navigation**

   - Press `0` to reset view instantly
   - Press `F` for distraction-free fullscreen

3. **Annotation Workflow**

   - Create multiple pins first
   - Then go back and add detailed notes
   - Hover over pins to preview text

4. **Keyboard Power User**
   - Learn the shortcuts (see table above)
   - Much faster than clicking buttons
   - Ctrl+Enter saves annotations quickly

### 🎨 Visual Feedback

- **Hover over controls** → See tooltips
- **Hover over pins** → Preview annotation
- **Pins pulse** → Easy to spot
- **Active button** → Glows blue

### 📱 Mobile Usage

- **Pinch** to zoom
- **Drag** to pan
- **Double-tap** to create annotation
- **Tap pin** to edit
- Controls adapt to screen size

---

## What You Can Do

### ✅ Viewer Features

- [x] Pan and zoom smoothly
- [x] Rotate image
- [x] Fullscreen mode
- [x] Reset to home view
- [x] Keyboard shortcuts

### ✅ Annotation Features

- [x] Create unlimited annotations
- [x] Edit annotation text
- [x] Delete annotations
- [x] Hover to preview
- [x] Persistent storage
- [x] Toggle visibility

### ✅ UI Features

- [x] Modern glass morphism design
- [x] Smooth animations
- [x] Responsive (mobile/tablet/desktop)
- [x] Tooltips on all controls
- [x] Loading states
- [x] Error handling

---

## Troubleshooting

### Viewer Not Loading?

1. Check browser console (F12)
2. Look for error messages
3. Verify DZI file exists
4. Hard refresh (Ctrl+Shift+R)

### Annotations Not Saving?

1. Check if localStorage is enabled
2. Not in private/incognito mode?
3. Try: `localStorage.clear()` in console

### Controls Not Showing?

1. Wait for image to load
2. Look for loading indicator
3. Refresh page

**See TROUBLESHOOTING.md for detailed help**

---

## File Structure

```
app/
  viewer/
    [imageId]/
      page.tsx          → Main viewer page
  dashboard/
    page.tsx            → Image selection

components/
  viewer/
    control-panel.tsx   → Bottom controls
    annotation-pin.tsx  → Pin markers
    annotation-popup.tsx → Edit modal

lib/
  annotations.ts        → Storage utilities
```

---

## Next Steps

### Add More Images

1. Generate tiles: `node scripts/generate-tiles.js image.jpg name`
2. Update `tile-image-search.tsx` with new image
3. Restart dev server

### Deploy to Production

1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Update tile URLs to CloudFront

### Customize

- Change colors in control-panel.tsx
- Modify pin styles in annotation-pin.tsx
- Add more keyboard shortcuts
- Implement additional features

---

## Resources

- **Full Documentation:** VIEWER_IMPROVEMENTS_SUMMARY.md
- **Troubleshooting:** TROUBLESHOOTING.md
- **AWS Setup:** AWS_TILES_ONLY_GUIDE.md
- **OpenSeadragon Docs:** https://openseadragon.github.io/

---

## Support

**Having issues?**

1. Check TROUBLESHOOTING.md
2. Look at browser console
3. Try hard refresh
4. Clear localStorage

**Want to customize?**

1. Read VIEWER_IMPROVEMENTS_SUMMARY.md
2. Check component files
3. Modify styles as needed

---

**Happy exploring! 🌌✨**

Start with: `npm run dev` → `http://localhost:3000/dashboard`
