"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlPanel } from "@/components/viewer/control-panel";
import { AnnotationPopup } from "@/components/viewer/annotation-popup";
import { AnnotationList } from "@/components/viewer/annotation-list";
import { AnnotationOverlay } from "@/components/viewer/annotation-overlay";
import {
  Annotation,
  getAnnotations,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from "@/lib/annotations";

// Import OpenSeadragon types
declare global {
  interface Window {
    OpenSeadragon: any;
  }
}

interface ViewerPageProps {
  params: Promise<{
    imageId: string;
  }>;
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerRef = useRef<HTMLDivElement>(null);

  const [viewer, setViewer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showAnnotationList, setShowAnnotationList] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<Annotation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageId, setImageId] = useState<string>("");

  // Get image data from URL parameters
  const dziUrl = searchParams.get("dziUrl");
  const imageName = searchParams.get("name") || "Cosmic Image";

  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setImageId(resolvedParams.imageId);
    });
  }, [params]);

  useEffect(() => {
    // Wait for imageId to be set
    if (!imageId) return;

    // Validate required parameters
    if (!dziUrl) {
      setError("Missing image data. Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return;
    }

    // Load existing annotations
    const existingAnnotations = getAnnotations(imageId);
    setAnnotations(existingAnnotations);

    // Initialize OpenSeadragon - wait for ref to be ready
    const timer = setTimeout(() => {
      initializeViewer();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [dziUrl, router, imageId]);

  const initializeViewer = () => {
    // Check if ref is ready
    if (!viewerRef.current) {
      console.error("❌ viewerRef is not available");
      setError("Viewer container not ready");
      setIsLoading(false);
      return;
    }

    console.log("✅ viewerRef is ready");

    // Check if OpenSeadragon is already loaded
    if (window.OpenSeadragon) {
      console.log("✅ OpenSeadragon already loaded");
      createViewer();
      return;
    }

    // Load OpenSeadragon script
    const existingScript = document.querySelector(
      'script[src*="openseadragon"]'
    );

    if (existingScript) {
      console.log("⏳ OpenSeadragon script loading...");
      const checkLoaded = setInterval(() => {
        if (window.OpenSeadragon) {
          clearInterval(checkLoaded);
          createViewer();
        }
      }, 100);
      return;
    }

    console.log("📥 Loading OpenSeadragon script...");
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/openseadragon.min.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ OpenSeadragon script loaded");
      createViewer();
    };

    script.onerror = () => {
      console.error("❌ Failed to load OpenSeadragon script");
      setError("Failed to load OpenSeadragon library");
      setIsLoading(false);
    };

    document.head.appendChild(script);
  };

  const createViewer = () => {
    if (!viewerRef.current) {
      console.error("❌ viewerRef is not available");
      setError("Viewer container not ready");
      setIsLoading(false);
      return;
    }

    if (!window.OpenSeadragon) {
      console.error("❌ OpenSeadragon is not loaded");
      setError("OpenSeadragon library not loaded");
      setIsLoading(false);
      return;
    }

    console.log("🚀 Initializing OpenSeadragon");
    console.log("   DZI URL:", dziUrl);
    console.log("   Viewer element:", viewerRef.current);
    console.log("   OpenSeadragon version:", window.OpenSeadragon.version);

    try {
      const newViewer = window.OpenSeadragon({
        id: viewerRef.current.id || "openseadragon-viewer",
        element: viewerRef.current,
        tileSources: dziUrl,
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",

        // Appearance
        showNavigationControl: false, // We'll use our custom controls
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        showRotationControl: false,

        // Performance
        springStiffness: 6.5,
        animationTime: 1.0,
        blendTime: 0.1,
        constrainDuringPan: true,
        wrapHorizontal: false,
        wrapVertical: false,
        visibilityRatio: 1,
        minZoomLevel: 0.5,
        maxZoomLevel: 20,
        minZoomImageRatio: 0.8,
        maxZoomPixelRatio: 2,

        // Styling
        backgroundColor: "#000000",
        opacity: 1,

        // Gestures
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: false,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
          flickMinSpeed: 120,
          flickMomentum: 0.25,
        },

        // Loading
        loadTilesWithAjax: true,
        ajaxWithCredentials: false,
        useCanvas: true,

        // Debugging
        debugMode: false,
        showNavigator: false,

        // Tile loading optimization
        immediateRender: false,
        preload: true,
      });

      console.log("✅ OpenSeadragon viewer created:", newViewer);

      // Event listeners
      newViewer.addHandler("open", () => {
        console.log("✅ Image loaded successfully");
        setIsLoading(false);
        setError(null);
      });

      newViewer.addHandler("open-failed", (event: any) => {
        console.error("❌ Failed to load image:", event);
        console.error("   Event details:", event);
        setError(`Failed to load image: ${event.message || "Unknown error"}`);
        setIsLoading(false);
      });

      newViewer.addHandler("tile-load-failed", (event: any) => {
        console.error("❌ Tile load failed:", event);
      });

      newViewer.addHandler("full-screen", (event: any) => {
        setIsFullscreen(event.fullScreen);
      });

      // Right-click handler for creating annotations
      newViewer.addHandler("canvas-contextmenu", (event: any) => {
        event.preventDefaultAction = true; // Prevent browser context menu

        const webPoint = event.position;
        const viewportPoint = newViewer.viewport.pointFromPixel(webPoint);

        // Get current zoom level
        const currentZoom = newViewer.viewport.getZoom();

        // Create new annotation with empty text (user will name it) and zoom level
        const newAnnotation = addAnnotation(
          imageId,
          viewportPoint.x,
          viewportPoint.y,
          "", // Empty text - user will add name in popup
          "#3b82f6", // Default color
          currentZoom // Store zoom level at creation
        );

        // Update state and open popup immediately
        setAnnotations((prev) => [...prev, newAnnotation]);
        setSelectedAnnotation(newAnnotation);

        console.log(
          "📌 Added annotation at:",
          viewportPoint.x,
          viewportPoint.y,
          "zoom:",
          currentZoom
        );
      });

      setViewer(newViewer);
    } catch (err: any) {
      console.error("❌ Error initializing viewer:", err);
      setError(`Failed to initialize viewer: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleToggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  const handleAnnotationZoom = (annotation: Annotation) => {
    if (!viewer) return;

    // Convert annotation coordinates to viewport point
    const viewportPoint = new window.OpenSeadragon.Point(
      annotation.x,
      annotation.y
    );

    // Zoom to the annotation with animation
    viewer.viewport.panTo(viewportPoint, true);
    viewer.viewport.zoomTo(
      viewer.viewport.getMaxZoom() * 0.5,
      viewportPoint,
      true
    );

    console.log("🔍 Zoomed to annotation:", annotation.text);
  };

  const handleAnnotationSave = (annotationId: string, text: string) => {
    const success = updateAnnotation(imageId, annotationId, { text });
    if (success) {
      setAnnotations((prev) =>
        prev.map((a) => (a.id === annotationId ? { ...a, text } : a))
      );
      console.log("✅ Annotation updated");
    }
  };

  const handleAnnotationDelete = (annotationId: string) => {
    const success = deleteAnnotation(imageId, annotationId);
    if (success) {
      setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
      console.log("🗑️ Annotation deleted");
    }
  };

  const handlePopupClose = () => {
    setSelectedAnnotation(null);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Viewer
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button onClick={handleBackToDashboard} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Main viewer layout
  return (
    <div className="fixed inset-0 bg-black">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cosmic image...</p>
          </div>
        </div>
      )}

      {/* Viewer container - always rendered so ref is available */}
      <div
        ref={viewerRef}
        id="openseadragon-viewer"
        onContextMenu={(e) => e.preventDefault()} // Prevent browser context menu
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
        }}
      />

      {/* Annotations Overlay - sticks to image coordinates */}
      {viewer && !isLoading && (
        <AnnotationOverlay
          viewer={viewer}
          annotations={annotations}
          visible={showAnnotations}
          onAnnotationClick={handleAnnotationClick}
        />
      )}

      {/* Annotation List */}
      {viewer && !isLoading && (
        <AnnotationList
          annotations={annotations}
          onAnnotationClick={handleAnnotationZoom}
          onAnnotationDelete={handleAnnotationDelete}
          onAnnotationEdit={handleAnnotationClick}
          isVisible={showAnnotationList}
          onToggle={() => setShowAnnotationList(!showAnnotationList)}
          viewer={viewer}
          imageName={imageName}
        />
      )}

      {/* Control Panel */}
      {viewer && !isLoading && (
        <ControlPanel
          viewer={viewer}
          imageName={imageName}
          onBack={handleBackToDashboard}
          annotationCount={annotations.length}
          showAnnotations={showAnnotations}
          onToggleAnnotations={handleToggleAnnotations}
          isFullscreen={isFullscreen}
        />
      )}

      {/* Annotation Popup */}
      <AnnotationPopup
        annotation={selectedAnnotation}
        onSave={handleAnnotationSave}
        onDelete={handleAnnotationDelete}
        onClose={handlePopupClose}
      />

      {/* Instructions */}
      {viewer && !isLoading && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs text-white/80 border border-white/10 max-w-xs z-40">
          <div className="space-y-1">
            <div>• Drag to pan • Scroll to zoom</div>
            <div>• Right-click to add annotation</div>
            <div>• Click pins to edit • Use controls at bottom</div>
          </div>
        </div>
      )}
    </div>
  );
}
