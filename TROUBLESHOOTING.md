# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Cannot initialize: viewerRef or OpenSeadragon not available"

**Cause:** The viewer is trying to initialize before the DOM element is ready or before OpenSeadragon script loads.

**Solution:** ✅ Fixed! The viewer now waits for both the ref and OpenSeadragon to be ready.

**What was changed:**

- Added retry logic to wait for viewerRef
- Added better logging to track initialization
- Improved error handling

---

### Issue: Viewer page shows blank screen

**Possible Causes:**

1. Missing DZI URL in navigation
2. DZI file doesn't exist
3. OpenSeadragon failed to load

**Solutions:**

1. **Check URL parameters:**

   - URL should look like: `/viewer/image-id?dziUrl=/tiles/image.dzi&name=Image%20Name`
   - Make sure `dziUrl` parameter is present

2. **Verify DZI file exists:**

   - Check that the file exists at the path specified in `dziUrl`
   - For local files: `public/tiles/your-image.dzi`

3. **Check browser console:**
   - Press F12 to open DevTools
   - Look for error messages
   - Check Network tab for failed requests

---

### Issue: Annotations not saving

**Possible Causes:**

1. localStorage is disabled
2. Browser in private/incognito mode
3. Storage quota exceeded

**Solutions:**

1. **Check localStorage:**

   ```javascript
   // In browser console:
   localStorage.getItem("cosmic-canvas-annotations");
   ```

2. **Clear old data:**

   ```javascript
   // In browser console:
   localStorage.removeItem("cosmic-canvas-annotations");
   ```

3. **Check browser settings:**
   - Ensure cookies/storage is enabled
   - Exit private/incognito mode

---

### Issue: Control panel not showing

**Possible Causes:**

1. Viewer not initialized
2. CSS not loaded
3. Z-index conflict

**Solutions:**

1. **Check viewer state:**

   - Look for loading indicator
   - Check console for errors

2. **Verify viewer initialized:**

   - Control panel only shows after viewer loads
   - Wait for "✅ Image loaded successfully" in console

3. **Check CSS:**
   - Refresh page (Ctrl+R)
   - Clear browser cache (Ctrl+Shift+R)

---

### Issue: Images not loading from AWS

**Possible Causes:**

1. Incorrect CloudFront URL
2. CORS issues
3. Files not uploaded

**Solutions:**

1. **Verify CloudFront URL:**

   ```typescript
   // In tile-image-search.tsx, check:
   dziUrl: "https://YOUR-DOMAIN.cloudfront.net/tiles/image.dzi";
   ```

2. **Test URL directly:**

   - Open CloudFront URL in browser
   - Should see XML content
   - If 403: Check S3 bucket policy
   - If 404: Check file path

3. **Check S3 upload:**
   ```bash
   aws s3 ls s3://your-bucket/tiles/ --recursive
   ```

---

### Issue: Keyboard shortcuts not working

**Possible Causes:**

1. Focus not on viewer
2. Input field is focused
3. Browser shortcuts conflict

**Solutions:**

1. **Click on viewer area first**

   - Keyboard shortcuts need focus

2. **Close annotation popup**

   - Press Escape to close popup
   - Then try shortcuts

3. **Check browser shortcuts:**
   - Some browsers override certain keys
   - Try different keys

---

### Issue: Annotations appear in wrong location

**Possible Causes:**

1. Coordinate calculation issue
2. Zoom level changed
3. Image rotated

**Solutions:**

1. **Reset view:**

   - Click Home button (or press 0)
   - Try creating annotation again

2. **Refresh page:**

   - Annotations should persist
   - Positions should be correct

3. **Clear and recreate:**
   - Delete problematic annotation
   - Create new one

---

### Issue: Mobile controls not working

**Possible Causes:**

1. Touch events not registered
2. Viewport too small
3. CSS not responsive

**Solutions:**

1. **Use touch gestures:**

   - Pinch to zoom
   - Drag to pan
   - Double-tap to create annotation

2. **Rotate device:**

   - Landscape mode gives more space
   - Controls adapt to orientation

3. **Check viewport:**
   - Ensure device width > 320px
   - Zoom out browser if needed

---

### Issue: Performance is slow

**Possible Causes:**

1. Too many annotations
2. Large tile files
3. Slow network

**Solutions:**

1. **Reduce annotations:**

   - Delete unused annotations
   - Keep under 100 per image

2. **Optimize tiles:**

   - Use appropriate tile size (256x256)
   - Compress images before tiling
   - Use JPEG for photos

3. **Check network:**
   - Use CloudFront for faster delivery
   - Check Network tab in DevTools
   - Look for slow requests

---

## Debug Mode

### Enable Verbose Logging

Add this to your browser console:

```javascript
localStorage.setItem("debug", "cosmic-canvas:*");
```

### Check Viewer State

```javascript
// In browser console while on viewer page:
console.log("Viewer:", window.viewer);
console.log("Annotations:", localStorage.getItem("cosmic-canvas-annotations"));
```

### Test OpenSeadragon

```javascript
// Check if OpenSeadragon is loaded:
console.log("OpenSeadragon:", window.OpenSeadragon);
```

---

## Browser Console Messages

### Good Messages (Everything Working)

```
📥 Loading OpenSeadragon script...
✅ OpenSeadragon script loaded
🚀 Initializing OpenSeadragon with DZI: /tiles/image.dzi
✅ Image loaded successfully
📌 Added annotation: {...}
✅ Annotation updated
```

### Warning Messages (Check These)

```
⏳ Waiting for viewerRef...
⏳ OpenSeadragon script loading...
```

These are normal during initialization but shouldn't persist.

### Error Messages (Need Fixing)

```
❌ viewerRef is not available
❌ OpenSeadragon is not loaded
❌ Failed to load image
❌ Failed to load OpenSeadragon script
```

These indicate problems that need to be fixed.

---

## Getting Help

### Information to Provide

When reporting issues, include:

1. **Browser and version**

   - Chrome 120, Firefox 121, etc.

2. **Console errors**

   - Copy full error messages
   - Include stack traces

3. **Steps to reproduce**

   - What you clicked
   - What you expected
   - What actually happened

4. **Screenshots**

   - Show the issue visually
   - Include browser console

5. **URL**
   - Full URL including parameters
   - Helps identify routing issues

---

## Quick Fixes

### Nuclear Option (Fixes Most Issues)

1. **Clear everything:**

   ```javascript
   localStorage.clear();
   ```

2. **Hard refresh:**

   - Windows: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

3. **Restart dev server:**

   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"

---

## Still Having Issues?

1. Check the browser console (F12)
2. Look for error messages
3. Try the nuclear option above
4. Check that all files were created correctly
5. Verify your tiles exist in `public/tiles/`

---

**Most issues are resolved by:**

- ✅ Hard refresh (Ctrl+Shift+R)
- ✅ Checking browser console
- ✅ Verifying file paths
- ✅ Clearing localStorage

Good luck! 🚀
