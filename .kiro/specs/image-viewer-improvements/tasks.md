# Implementation Plan

- [x] 1. Create dedicated viewer page route and basic layout



  - Create `app/viewer/[imageId]/page.tsx` with basic structure
  - Implement URL parameter handling for imageId, dziUrl, and name
  - Add redirect logic for invalid/missing parameters
  - Create basic full-screen layout with navigation back to dashboard
  - _Requirements: 1.1, 1.3, 1.4, 1.5_


- [x] 2. Implement modern control panel component



  - [ ] 2.1 Create ControlPanel component structure

    - Create `components/viewer/control-panel.tsx`
    - Define TypeScript interfaces for props and control buttons


    - Implement basic component structure with all control buttons
    - _Requirements: 2.1, 2.2_

  - [ ] 2.2 Style control panel with glass morphism design

    - Apply glass morphism styling (backdrop blur, transparency, borders)

    - Implement hover and active states for all buttons
    - Add smooth transitions and animations
    - Ensure proper spacing and alignment
    - _Requirements: 2.2, 2.3, 2.4, 2.7_

  - [ ] 2.3 Implement control actions

    - Wire up zoom in/out functionality to OpenSeadragon API

    - Implement rotate left/right actions
    - Implement reset view (home) action
    - Implement fullscreen toggle
    - Add back to dashboard navigation
    - _Requirements: 2.1, 2.2_

  - [x] 2.4 Add tooltips and accessibility


    - Implement tooltip component or use existing UI library
    - Add tooltips to all control buttons
    - Add ARIA labels for screen readers
    - Implement keyboard shortcuts for controls

    - _Requirements: 2.5, 5.5_



  - [ ] 2.5 Make control panel responsive
    - Implement mobile layout (vertical stack at bottom)
    - Implement tablet layout (horizontal bar)
    - Implement desktop layout (floating panel)
    - Test on different screen sizes
    - _Requirements: 2.8, 5.1, 5.2, 5.3_



- [ ] 3. Implement annotation system core functionality

  - [ ] 3.1 Create annotation data structures and storage

    - Define Annotation interface in TypeScript
    - Implement localStorage utility functions (save, load, delete)


    - Create annotation storage key structure by imageId
    - Add error handling for localStorage operations
    - _Requirements: 3.5, 3.10_

  - [ ] 3.2 Create AnnotationPin component

    - Create `components/viewer/annotation-pin.tsx`
    - Implement pin rendering with proper positioning
    - Style pin with modern design (circle, border, shadow)


    - Implement hover effects and scaling
    - Add click handler to open edit popup
    - _Requirements: 3.2, 3.6, 3.12_

  - [x] 3.3 Implement annotation creation on double-click


    - Add double-click event listener to OpenSeadragon canvas
    - Convert pixel coordinates to viewport coordinates
    - Create new annotation object with coordinates
    - Add annotation to state and localStorage
    - Render new pin immediately
    - _Requirements: 3.1, 3.2, 3.4_


  - [ ] 3.4 Create annotation edit popup component

    - Create `components/viewer/annotation-popup.tsx`
    - Implement modal/popup UI with modern styling
    - Add text input field for annotation text
    - Add save and cancel buttons
    - Implement close on Escape key

    - _Requirements: 3.3, 3.4, 3.11_

  - [ ] 3.5 Implement annotation CRUD operations

    - Implement save annotation functionality
    - Implement edit existing annotation
    - Implement delete annotation with confirmation

    - Update localStorage on all operations
    - Add success/error feedback
    - _Requirements: 3.3, 3.4, 3.7_

  - [x] 3.6 Implement annotation scaling with zoom


    - Calculate pin position based on viewport coordinates
    - Update pin positions on zoom/pan events
    - Ensure pins stay anchored to image features
    - Test at various zoom levels
    - _Requirements: 3.8_

  - [ ] 3.7 Implement annotation hover preview

    - Create tooltip component for annotation preview
    - Show annotation text on pin hover
    - Position tooltip to avoid viewport edges
    - Add smooth fade in/out animation
    - _Requirements: 3.6_



  - [ ] 3.8 Implement annotation toggle and counter
    - Add toggle button to control panel

    - Show/hide all annotations based on toggle state
    - Display annotation count in control panel
    - Persist toggle state in session
    - _Requirements: 3.9_



- [ ] 4. Integrate viewer page with OpenSeadragon

  - [ ] 4.1 Set up OpenSeadragon viewer instance

    - Initialize OpenSeadragon in viewer page
    - Configure viewer options (zoom, pan, rotation settings)
    - Implement loading state while viewer initializes
    - Handle OpenSeadragon load errors
    - _Requirements: 1.2, 4.2_

  - [ ] 4.2 Connect control panel to viewer instance

    - Pass viewer instance to ControlPanel component
    - Verify all control actions work correctly

    - Test zoom, pan, rotate, and reset functionality


    - Test fullscreen mode
    - _Requirements: 2.1_

  - [ ] 4.3 Connect annotation system to viewer instance
    - Pass viewer instance to annotation components
    - Implement coordinate conversion utilities
    - Test annotation positioning at different zoom levels


    - Verify annotations stay anchored correctly
    - _Requirements: 3.1, 3.8_

- [ ] 5. Update dashboard navigation

  - [ ] 5.1 Modify TileImageSearch component


    - Import Next.js useRouter hook
    - Update handleImageSelect to navigate to viewer page
    - Pass image data via URL search params
    - Remove old state management code
    - _Requirements: 1.1_


  - [x] 5.2 Update dashboard page component

    - Remove inline OpenSeadragonViewer component
    - Simplify dashboard to focus on search and browse
    - Update layout to show only search interface
    - Test navigation flow from dashboard to viewer
    - _Requirements: 1.1, 1.4_

- [x] 6. Implement loading and error states


  - [ ] 6.1 Add loading indicators

    - Create loading spinner component
    - Show loading state while OpenSeadragon initializes
    - Show loading state while image tiles load
    - Add loading state for annotation operations

    - _Requirements: 4.2_

  - [ ] 6.2 Implement error handling

    - Add error boundary for viewer page


    - Handle invalid image ID errors
    - Handle missing DZI URL errors

    - Handle OpenSeadragon initialization errors
    - Display user-friendly error messages
    - _Requirements: 1.5, 4.3_

  - [ ] 6.3 Add success feedback
    - Show toast notification on annotation save
    - Show toast notification on annotation delete

    - Add visual feedback for control actions
    - Implement smooth transitions for state changes
    - _Requirements: 4.4_

- [ ] 7. Implement animations and transitions

  - [x] 7.1 Add page transition animations


    - Implement fade-in animation for viewer page
    - Add slide-in animation for control panel
    - Add smooth transitions between pages
    - Test animation performance
    - _Requirements: 4.1_

  - [ ] 7.2 Add control interaction animations

    - Implement button hover animations
    - Add button press animations
    - Implement tooltip fade animations
    - Add smooth transitions for all interactive elements
    - _Requirements: 4.3_

  - [ ] 7.3 Add annotation animations
    - Implement pin creation animation (scale in)
    - Add pin deletion animation (scale out)
    - Implement popup open/close animations
    - Add hover preview fade animations
    - _Requirements: 4.4_

- [ ] 8. Implement responsive design

  - [ ] 8.1 Test and optimize mobile layout

    - Test viewer on mobile devices
    - Optimize control panel for touch
    - Ensure annotations are touch-friendly
    - Test double-tap for annotation creation
    - _Requirements: 5.1_

  - [ ] 8.2 Test and optimize tablet layout

    - Test viewer on tablet devices
    - Optimize control panel layout for medium screens
    - Test touch and mouse interactions
    - Verify responsive breakpoints work correctly
    - _Requirements: 5.2_

  - [ ] 8.3 Test and optimize desktop layout
    - Test viewer on various desktop screen sizes
    - Optimize control panel positioning
    - Test keyboard shortcuts
    - Verify all features work on desktop
    - _Requirements: 5.3_

- [ ] 9. Implement keyboard shortcuts

  - Create keyboard shortcut handler utility
  - Implement shortcuts for zoom (+, -)
  - Implement shortcuts for rotate (r, R)
  - Implement shortcut for reset view (0)
  - Implement shortcut for fullscreen (f)
  - Implement shortcut for toggle annotations (a)
  - Implement shortcut for back to dashboard (Backspace)
  - Add keyboard shortcut help modal
  - _Requirements: 5.4_

- [ ] 10. Add accessibility features

  - Add ARIA labels to all interactive elements
  - Implement focus management for popups
  - Add visible focus indicators
  - Test with screen reader
  - Ensure proper heading hierarchy
  - Add skip links for keyboard navigation
  - Test keyboard-only navigation
  - _Requirements: 5.5_

- [ ] 11. Write unit tests for components

  - Write tests for ControlPanel component
  - Write tests for AnnotationPin component
  - Write tests for AnnotationPopup component
  - Write tests for annotation storage utilities
  - Write tests for coordinate conversion utilities
  - Achieve >80% code coverage
  - _Requirements: All_

- [ ] 12. Perform integration testing

  - Test complete flow: dashboard → viewer → annotations → back
  - Test annotation persistence across page reloads
  - Test all control actions in sequence
  - Test error scenarios and recovery
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on multiple devices (mobile, tablet, desktop)
  - _Requirements: All_

- [ ] 13. Performance optimization

  - Implement lazy loading for OpenSeadragon
  - Memoize expensive computations
  - Debounce annotation save operations
  - Optimize annotation rendering for many pins
  - Test and optimize page load time
  - Ensure smooth 60fps animations
  - _Requirements: All_

- [ ] 14. Final polish and documentation
  - Review and refine all styling
  - Ensure consistent design language
  - Add code comments and documentation
  - Create user guide for annotations
  - Update README with new features
  - Create demo video or screenshots
  - _Requirements: All_
