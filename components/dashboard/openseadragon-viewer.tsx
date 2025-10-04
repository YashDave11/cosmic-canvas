"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pin, Info, Maximize, Home, RotateCw, RotateCcw } from "lucide-react";

// Import OpenSeadragon types
declare global {
  interface Window {
    OpenSeadragon: any;
  }
}

interface OpenSeadragonViewerProps {
  dziUrl: string;
  imageName?: string;
}

export function OpenSeadragonViewer({
  dziUrl,
  imageName = "Cosmic Image",
}: OpenSeadragonViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [annotations, setAnnotations] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      note: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if OpenSeadragon is already loaded
    if (window.OpenSeadragon) {
      initializeViewer();
      return;
    }

    // Load OpenSeadragon script
    const existingScript = document.querySelector(
      'script[src*="openseadragon"]'
    );

    if (existingScript) {
      // Script is loading or loaded, wait for it
      const checkLoaded = setInterval(() => {
        if (window.OpenSeadragon) {
          clearInterval(checkLoaded);
          initializeViewer();
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/openseadragon.min.js";
    script.async = true;

    script.onload = () => {
      initializeViewer();
    };

    script.onerror = () => {
      setError("Failed to load OpenSeadragon library");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [dziUrl]);

  const initializeViewer = () => {
    if (!viewerRef.current || !window.OpenSeadragon) {
      console.log(
        "❌ Cannot initialize: viewerRef or OpenSeadragon not available"
      );
      return;
    }

    console.log("🚀 Initializing OpenSeadragon with DZI:", dziUrl);

    try {
      const newViewer = window.OpenSeadragon({
        id: viewerRef.current.id || "openseadragon-viewer",
        element: viewerRef.current,
        tileSources: dziUrl,
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",

        // Appearance
        showNavigationControl: true,
        navigationControlAnchor: window.OpenSeadragon.ControlAnchor.TOP_RIGHT,
        showZoomControl: true,
        showHomeControl: true,
        showFullPageControl: true,
        showRotationControl: true,

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

        // Debugging - DISABLE to remove blue grid overlay
        debugMode: false,
        debugGridColor: ["#000000", "#000000", "#000000", "#000000", "#000000"],
        showNavigator: false,

        // Tile loading optimization
        immediateRender: false,
        preload: true,
      });

      // Event listeners
      newViewer.addHandler("open", () => {
        console.log("✅ Image loaded successfully");
        setIsLoading(false);
        setError(null);
      });

      newViewer.addHandler("open-failed", (event: any) => {
        console.error("❌ Failed to load image:", event);
        setError(`Failed to load image: ${event.message || "Unknown error"}`);
        setIsLoading(false);
      });

      newViewer.addHandler("tile-loaded", () => {
        console.log("🎨 Tile loaded");
      });

      newViewer.addHandler("tile-load-failed", (event: any) => {
        console.error("❌ Tile load failed:", event);
      });

      // Click handler for annotations
      newViewer.addHandler("canvas-click", (event: any) => {
        if (event.quick && event.originalEvent.detail === 2) {
          // Double click
          const webPoint = event.position;
          const viewportPoint = newViewer.viewport.pointFromPixel(webPoint);

          const newAnnotation = {
            id: Date.now().toString(),
            x: viewportPoint.x,
            y: viewportPoint.y,
            note: `Discovery at ${(viewportPoint.x * 100).toFixed(1)}%, ${(
              viewportPoint.y * 100
            ).toFixed(1)}%`,
          };

          setAnnotations((prev) => [...prev, newAnnotation]);
          console.log("📌 Added annotation:", newAnnotation);
        }
      });

      setViewer(newViewer);
    } catch (err: any) {
      console.error("❌ Error initializing viewer:", err);
      setError(`Failed to initialize viewer: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleHomeZoom = () => {
    if (viewer) {
      viewer.viewport.goHome();
    }
  };

  const handleRotateLeft = () => {
    if (viewer) {
      viewer.viewport.setRotation(viewer.viewport.getRotation() - 90);
    }
  };

  const handleRotateRight = () => {
    if (viewer) {
      viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
    }
  };

  const handleFullscreen = () => {
    if (viewer) {
      viewer.setFullScreen(!viewer.isFullScreen());
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
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
            Failed to Load Image
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">
            Make sure the DZI file exists at: {dziUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleHomeZoom}
            className="border-border/30"
            disabled={!viewer}
          >
            <Home className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateLeft}
            className="border-border/30"
            disabled={!viewer}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateRight}
            className="border-border/30"
            disabled={!viewer}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground ml-2">{imageName}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAnnotations ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={showAnnotations ? "bg-primary" : "border-border/30"}
          >
            <Pin className="w-4 h-4 mr-1" />
            Pins ({annotations.length})
          </Button>
          <Button variant="outline" size="sm" className="border-border/30">
            <Info className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="border-border/30"
            disabled={!viewer}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Viewer Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading cosmic image...</p>
            </div>
          </div>
        )}

        <div
          ref={viewerRef}
          id="openseadragon-viewer"
          className="w-full h-full bg-muted/10"
          style={{ minHeight: "400px" }}
        />

        {/* Annotations Overlay */}
        {showAnnotations &&
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg cursor-pointer hover:scale-125 transition-transform z-20"
              style={{
                left: `${annotation.x * 100}%`,
                top: `${annotation.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={annotation.note}
            >
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded border border-border/30 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {annotation.note}
              </div>
            </div>
          ))}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs text-muted-foreground border border-border/30">
          <div className="space-y-1">
            <div>• Drag to pan • Scroll to zoom</div>
            <div>• Double-click to add discovery pins</div>
            <div>• Use controls for home/rotate/fullscreen</div>
          </div>
        </div>
      </div>
    </div>
  );
}
