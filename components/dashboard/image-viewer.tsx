"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Pin, Info } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
}

export function ImageViewer({ imageUrl }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [annotations, setAnnotations] = useState<
    Array<{ id: string; x: number; y: number; note: string }>
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.1));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(10, prev * delta)));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isDragging && e.detail === 2) {
      // Double click
      const rect = imageRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newAnnotation = {
          id: Date.now().toString(),
          x,
          y,
          note: `Annotation at ${x.toFixed(1)}%, ${y.toFixed(1)}%`,
        };

        setAnnotations((prev) => [...prev, newAnnotation]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="border-border/30"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="border-border/30"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-border/30"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground ml-2">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAnnotations ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={showAnnotations ? "bg-primary" : "border-border/30"}
          >
            <Pin className="w-4 h-4 mr-1" />
            Annotations ({annotations.length})
          </Button>
          <Button variant="outline" size="sm" className="border-border/30">
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-border/30">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-muted/20 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Cosmic image"
            className="max-w-none select-none"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
            onClick={handleImageClick}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Annotations */}
          {showAnnotations &&
            annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg cursor-pointer hover:scale-125 transition-transform"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`,
                  transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                }}
                title={annotation.note}
              >
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded border border-border/30 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {annotation.note}
                </div>
              </div>
            ))}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs text-muted-foreground border border-border/30">
          <div className="space-y-1">
            <div>• Drag to pan around the image</div>
            <div>• Scroll to zoom in/out</div>
            <div>• Double-click to add annotations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
