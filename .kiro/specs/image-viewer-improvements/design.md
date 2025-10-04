# Design Document

## Overview

This design document outlines the architecture and implementation approach for enhancing the Cosmic Canvas image viewer. The improvements include creating a dedicated viewer page with modern controls and a comprehensive annotation system. The design follows Next.js 13+ App Router conventions and maintains consistency with the existing dark space theme.

## Architecture

### High-Level Architecture

```
Dashboard Page (Search & Browse)
        ↓
    User clicks image
        ↓
Viewer Page (Full Experience)
        ↓
    ├── Modern Control Panel
    ├── OpenSeadragon Viewer
    └── Annotation System
```

### Routing Structure

```
/dashboard              → Image search and selection
/viewer/[imageId]       → Dedicated viewer page with controls and annotations
```

### Data Flow

```
User Action → Component State → OpenSeadragon API → Visual Update
                ↓
        Local Storage (Annotations)
```

## Components and Interfaces

### 1. New Viewer Page Component

**Location:** `app/viewer/[imageId]/page.tsx`

**Purpose:** Dedicated full-screen viewer experience

**Props/Params:**

```typescript
interface ViewerPageParams {
  params: {
    imageId: string;
  };
  searchParams: {
    dziUrl?: string;
    name?: string;
  };
}
```

**Responsibilities:**

- Receive image data via URL parameters
- Initialize viewer with full-screen layout
- Manage viewer state and controls
- Handle navigation back to dashboard
- Coordinate between controls and annotation system

### 2. Modern Control Panel Component

**Location:** `components/viewer/control-panel.tsx`

**Purpose:** Provide modern styled controls for image manipulation

**Interface:**

```typescript
interface ControlPanelProps {
  viewer: any; // OpenSeadragon viewer instance
  imageName: string;
  onBack: () => void;
  annotationCount: number;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
}

interface ControlButton {
  id: string;
  icon: React.ComponentType;
  label: string;
  action: () => void;
  tooltip: string;
  variant?: "default" | "outline" | "ghost";
}
```

**Features:**

- Glass morphism design with backdrop blur
- Smooth hover and active states
- Tooltips for all controls
- Responsive layout (horizontal on desktop, vertical on mobile)
- Keyboard shortcuts support

**Control Actions:**

- Zoom In (+)
- Zoom Out (-)
- Reset View (Home)
- Rotate Left (90° CCW)
- Rotate Right (90° CW)
- Fullscreen Toggle
- Toggle Annotations
- Back to Dashboard

### 3. Annotation System Component

**Location:** `components/viewer/annotation-system.tsx`

**Purpose:** Manage creation, display, and editing of annotations

**Interface:**

```typescript
interface Annotation {
  id: string;
  x: number; // Viewport coordinates (0-1)
  y: number; // Viewport coordinates (0-1)
  text: string;
  timestamp: number;
  color?: string;
}

interface AnnotationSystemProps {
  viewer: any; // OpenSeadragon viewer instance
  imageId: string;
  visible: boolean;
}
```

**Sub-components:**

- `AnnotationPin`: Visual marker on the image
- `AnnotationPopup`: Modal for editing annotation text
- `AnnotationList`: Sidebar showing all annotations

**Features:**

- Double-click to create annotation
- Click pin to view/edit
- Hover to preview text
- Delete functionality
- Persistent storage (localStorage)
- Proper scaling with zoom
- Color-coded pins (optional)

### 4. Updated Dashboard Component

**Location:** `app/dashboard/page.tsx` (modified)

**Changes:**

- Remove inline viewer
- Navigate to `/viewer/[imageId]` on image selection
- Pass image data via URL parameters

### 5. Updated Image Search Component

**Location:** `components/dashboard/tile-image-search.tsx` (modified)

**Changes:**

- Update `onImageSelect` to navigate instead of setting state
- Use Next.js router for navigation

## Data Models

### Image Metadata

```typescript
interface ImageMetadata {
  id: string;
  name: string;
  dziUrl: string;
  thumbnailUrl: string;
  description: string;
  size: string;
  levels: number;
}
```

### Annotation Data

```typescript
interface Annotation {
  id: string;
  imageId: string;
  x: number; // Viewport X coordinate (0-1)
  y: number; // Viewport Y coordinate (0-1)
  text: string;
  timestamp: number;
  color: string; // Hex color for the pin
  author?: string; // Future: user identification
}

interface AnnotationStorage {
  [imageId: string]: Annotation[];
}
```

### Viewer State

```typescript
interface ViewerState {
  isLoading: boolean;
  error: string | null;
  viewer: any | null; // OpenSeadragon instance
  showAnnotations: boolean;
  annotations: Annotation[];
  selectedAnnotation: string | null;
  isFullscreen: boolean;
}
```

## Styling and Design System

### Color Palette

Following the existing dark space theme:

```css
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--primary: 217.2 91.2% 59.8%
--muted: 217.2 32.6% 17.5%
--border: 217.2 32.6% 17.5%
```

### Control Panel Design

**Style Approach:** Glass morphism with space theme

```css
.control-panel {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.control-button {
  transition: all 0.2s ease;
  /* Hover: scale + glow */
  /* Active: scale down */
}
```

### Annotation Pin Design

```css
.annotation-pin {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: hsl(var(--primary));
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.annotation-pin:hover {
  transform: scale(1.3);
  z-index: 100;
}
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: "640px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
};
```

**Control Panel Layout:**

- Mobile: Vertical stack at bottom
- Tablet: Horizontal bar at bottom
- Desktop: Floating panel (top-right or bottom-center)

## Error Handling

### Error Scenarios

1. **Invalid Image ID**

   - Redirect to dashboard with error toast
   - Message: "Image not found"

2. **Missing DZI URL**

   - Redirect to dashboard with error toast
   - Message: "Invalid image data"

3. **Failed to Load Image**

   - Display error state in viewer
   - Provide retry button
   - Show helpful error message

4. **OpenSeadragon Load Failure**

   - Display fallback UI
   - Provide link to dashboard
   - Log error for debugging

5. **Annotation Save Failure**
   - Show error toast
   - Retry mechanism
   - Don't lose annotation data

### Error Handling Pattern

```typescript
try {
  // Operation
} catch (error) {
  console.error("Error context:", error);
  toast.error("User-friendly message");
  // Fallback behavior
}
```

## Testing Strategy

### Unit Tests

**Components to Test:**

- ControlPanel: Button actions, tooltips, responsive layout
- AnnotationSystem: Create, edit, delete, persist
- AnnotationPin: Rendering, positioning, interactions

**Test Cases:**

```typescript
describe("ControlPanel", () => {
  it("should render all control buttons", () => {});
  it("should call zoom in when + button clicked", () => {});
  it("should show tooltips on hover", () => {});
  it("should adapt layout for mobile", () => {});
});

describe("AnnotationSystem", () => {
  it("should create annotation on double-click", () => {});
  it("should save annotation to localStorage", () => {});
  it("should load existing annotations", () => {});
  it("should delete annotation", () => {});
  it("should scale pins with zoom", () => {});
});
```

### Integration Tests

**Scenarios:**

1. Navigate from dashboard to viewer
2. Create and save annotation
3. Return to dashboard and back to viewer (annotations persist)
4. Use all control buttons
5. Fullscreen mode
6. Mobile touch interactions

### Manual Testing Checklist

- [ ] Navigation: Dashboard → Viewer → Dashboard
- [ ] All control buttons work
- [ ] Annotations: Create, edit, delete
- [ ] Annotations persist after page reload
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Keyboard shortcuts work
- [ ] Fullscreen mode works
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Tooltips appear on hover
- [ ] Smooth animations and transitions

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**

   - Load OpenSeadragon only when needed
   - Lazy load annotation components

2. **Memoization**

   - Memoize control button callbacks
   - Memoize annotation rendering

3. **Debouncing**

   - Debounce annotation save operations
   - Debounce zoom/pan events

4. **Virtual Rendering**

   - Only render visible annotations
   - Cull off-screen pins

5. **Local Storage Optimization**
   - Compress annotation data
   - Limit storage size
   - Clean up old annotations

### Performance Metrics

**Target Metrics:**

- Initial page load: < 2s
- Time to interactive: < 3s
- Control response time: < 100ms
- Annotation creation: < 200ms
- Smooth 60fps animations

## Accessibility

### ARIA Labels

```typescript
const ariaLabels = {
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetView: "Reset view to home position",
  rotateLeft: "Rotate image 90 degrees counter-clockwise",
  rotateRight: "Rotate image 90 degrees clockwise",
  fullscreen: "Toggle fullscreen mode",
  toggleAnnotations: "Show or hide annotations",
  backToDashboard: "Return to dashboard",
  createAnnotation: "Double-click to create annotation",
  editAnnotation: "Edit annotation text",
  deleteAnnotation: "Delete this annotation",
};
```

### Keyboard Shortcuts

```typescript
const keyboardShortcuts = {
  "+": "Zoom in",
  "-": "Zoom out",
  "0": "Reset view",
  r: "Rotate right",
  R: "Rotate left (Shift+R)",
  f: "Toggle fullscreen",
  a: "Toggle annotations",
  Escape: "Exit fullscreen / Close popup",
  Backspace: "Back to dashboard",
};
```

### Focus Management

- Trap focus in annotation popup when open
- Restore focus after closing popup
- Visible focus indicators on all interactive elements
- Skip links for keyboard navigation

### Screen Reader Support

- Announce control actions
- Describe annotation count
- Announce annotation creation/deletion
- Provide text alternatives for visual elements

## Security Considerations

### Input Validation

```typescript
// Validate annotation text
const validateAnnotationText = (text: string): boolean => {
  if (!text || text.trim().length === 0) return false;
  if (text.length > 500) return false; // Max length
  // Sanitize HTML/script tags
  return !/<script|<iframe|javascript:/i.test(text);
};
```

### XSS Prevention

- Sanitize all user input
- Use React's built-in XSS protection
- Escape annotation text before rendering
- Validate URLs before navigation

### Local Storage Security

- Don't store sensitive data
- Validate data before reading from localStorage
- Handle corrupted data gracefully
- Implement storage quotas

## Migration Strategy

### Phase 1: Create New Viewer Page

- Create `/viewer/[imageId]` route
- Implement basic layout
- Test navigation

### Phase 2: Implement Modern Controls

- Create ControlPanel component
- Style with glass morphism
- Add all control actions
- Test responsiveness

### Phase 3: Implement Annotation System

- Create annotation components
- Implement double-click creation
- Add edit/delete functionality
- Implement persistence

### Phase 4: Update Dashboard

- Modify navigation logic
- Update image selection handler
- Test end-to-end flow

### Phase 5: Polish and Testing

- Add animations and transitions
- Implement keyboard shortcuts
- Accessibility audit
- Performance optimization
- Cross-browser testing

## Future Enhancements

### Potential Features

1. **Annotation Sharing**

   - Export annotations as JSON
   - Import annotations from file
   - Share via URL

2. **Collaborative Annotations**

   - Real-time collaboration
   - User identification
   - Comment threads

3. **Advanced Annotation Types**

   - Shapes (circles, rectangles, polygons)
   - Arrows and lines
   - Text labels
   - Measurements

4. **Annotation Categories**

   - Color-coded by type
   - Filter by category
   - Search annotations

5. **Image Comparison**

   - Side-by-side viewer
   - Overlay mode
   - Difference highlighting

6. **Export Capabilities**
   - Export current view as image
   - Export with annotations
   - PDF generation

## Technical Dependencies

### Required Packages

```json
{
  "dependencies": {
    "openseadragon": "^4.1.0",
    "lucide-react": "latest",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/openseadragon": "^3.0.0"
  }
}
```

### Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

## Conclusion

This design provides a comprehensive approach to enhancing the Cosmic Canvas viewer with a dedicated page, modern controls, and a robust annotation system. The architecture is scalable, maintainable, and follows Next.js best practices while maintaining the existing dark space theme aesthetic.
