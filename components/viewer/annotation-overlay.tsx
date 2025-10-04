"use client";

import { useEffect, useState, useRef } from "react";
import { Annotation } from "@/lib/annotations";
import { AnnotationPin } from "./annotation-pin";

interface AnnotationOverlayProps {
  viewer: any; // OpenSeadragon viewer instance
  annotations: Annotation[];
  visible: boolean;
  onAnnotationClick: (annotation: Annotation) => void;
}

export function AnnotationOverlay({
  viewer,
  annotations,
  visible,
  onAnnotationClick,
}: AnnotationOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [pinPositions, setPinPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  useEffect(() => {
    if (!viewer || !overlayRef.current) return;

    const updatePinPositions = () => {
      const newPositions = new Map<string, { x: number; y: number }>();

      annotations.forEach((annotation) => {
        // Convert viewport coordinates to pixel coordinates
        const viewportPoint = new window.OpenSeadragon.Point(
          annotation.x,
          annotation.y
        );
        const pixelPoint =
          viewer.viewport.viewportToViewerElementCoordinates(viewportPoint);

        newPositions.set(annotation.id, {
          x: pixelPoint.x,
          y: pixelPoint.y,
        });
      });

      setPinPositions(newPositions);
    };

    // Update positions on viewport changes
    viewer.addHandler("animation", updatePinPositions);
    viewer.addHandler("resize", updatePinPositions);
    viewer.addHandler("open", updatePinPositions);

    // Initial update
    updatePinPositions();

    return () => {
      viewer.removeHandler("animation", updatePinPositions);
      viewer.removeHandler("resize", updatePinPositions);
      viewer.removeHandler("open", updatePinPositions);
    };
  }, [viewer, annotations]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {annotations.map((annotation) => {
        const position = pinPositions.get(annotation.id);
        if (!position) return null;

        return (
          <div
            key={annotation.id}
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
          >
            <AnnotationPin
              annotation={annotation}
              onClick={onAnnotationClick}
            />
          </div>
        );
      })}
    </div>
  );
}
