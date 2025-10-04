import jsPDF from "jspdf";
import { Annotation } from "./annotations";

interface ExportOptions {
  imageName: string;
  annotations: Annotation[];
  viewer: any; // OpenSeadragon viewer instance
}

/**
 * Export annotations to PDF with zoomed snippets
 */
export async function exportAnnotationsToPDF({
  imageName,
  annotations,
  viewer,
}: ExportOptions): Promise<void> {
  if (!viewer || annotations.length === 0) {
    throw new Error("No annotations to export or viewer not available");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Title Page
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Annotation Report", pageWidth / 2, 40, { align: "center" });

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.text(imageName, pageWidth / 2, 55, { align: "center" });

  pdf.setFontSize(12);
  pdf.setTextColor(100);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  pdf.text(`Generated: ${date}`, pageWidth / 2, 65, { align: "center" });

  pdf.setFontSize(14);
  pdf.setTextColor(0);
  pdf.text(`Total Annotations: ${annotations.length}`, pageWidth / 2, 80, {
    align: "center",
  });

  // Add decorative line
  pdf.setDrawColor(59, 130, 246); // Primary color
  pdf.setLineWidth(0.5);
  pdf.line(margin, 90, pageWidth - margin, 90);

  // Process each annotation
  for (let i = 0; i < annotations.length; i++) {
    const annotation = annotations[i];

    // Add new page for each annotation (except first one uses title page)
    if (i > 0) {
      pdf.addPage();
    } else {
      // Continue on title page
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text("Scroll down for detailed annotations...", pageWidth / 2, 100, {
        align: "center",
      });
      pdf.addPage();
    }

    // Reset colors
    pdf.setTextColor(0);

    // Extra delay for first annotation to ensure viewer is fully ready
    if (i === 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Page header
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Annotation ${i + 1} of ${annotations.length}`, margin, 15);
    pdf.text(imageName, pageWidth - margin, 15, { align: "right" });

    // Annotation title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0);
    const title = annotation.text || `Annotation ${i + 1}`;
    pdf.text(title, margin, 30);

    // Divider line
    pdf.setDrawColor(200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 35, pageWidth - margin, 35);

    // Capture snippet image
    try {
      const snippetDataUrl = await captureAnnotationSnippet(
        viewer,
        annotation,
        500,
        500
      );

      // Add snippet image
      const imgWidth = 140; // mm
      const imgHeight = 140; // mm
      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = 45;

      pdf.addImage(snippetDataUrl, "PNG", imgX, imgY, imgWidth, imgHeight);

      // Add border around image
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.5);
      pdf.rect(imgX, imgY, imgWidth, imgHeight);

      // Annotation details below image
      let yPos = imgY + imgHeight + 15;

      // Coordinates section
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Coordinates:", margin, yPos);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      yPos += 7;

      // Viewport coordinates (0-1 range)
      pdf.text(
        `Viewport: X=${annotation.x.toFixed(6)}, Y=${annotation.y.toFixed(6)}`,
        margin + 5,
        yPos
      );
      yPos += 6;

      // Percentage coordinates
      pdf.text(
        `Percentage: X=${(annotation.x * 100).toFixed(2)}%, Y=${(
          annotation.y * 100
        ).toFixed(2)}%`,
        margin + 5,
        yPos
      );
      yPos += 10;

      // Zoom Level
      if (annotation.zoomLevel) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Zoom Level:", margin, yPos);
        pdf.setFont("helvetica", "normal");
        yPos += 6;
        pdf.text(`${annotation.zoomLevel.toFixed(4)}x`, margin + 5, yPos);
        yPos += 10;
      }

      // Timestamp
      pdf.setFont("helvetica", "bold");
      pdf.text("Created:", margin, yPos);
      pdf.setFont("helvetica", "normal");
      yPos += 6;
      const annotationDate = new Date(annotation.timestamp).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      pdf.text(annotationDate, margin + 5, yPos);
      yPos += 10;

      // Color
      pdf.setFont("helvetica", "bold");
      pdf.text("Pin Color:", margin, yPos);
      pdf.setFont("helvetica", "normal");
      yPos += 6;
      pdf.text(annotation.color, margin + 5, yPos);

      // Draw color swatch
      pdf.setFillColor(annotation.color);
      pdf.rect(margin + 25, yPos - 3, 8, 4, "F");

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text(
        `Page ${i + 2} of ${annotations.length + 1}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    } catch (error) {
      console.error(
        "Error capturing snippet for annotation:",
        annotation.id,
        error
      );

      // Show error message in PDF
      pdf.setFontSize(12);
      pdf.setTextColor(200, 0, 0);
      pdf.text("Error: Could not capture image snippet", pageWidth / 2, 100, {
        align: "center",
      });
    }
  }

  // Save PDF
  const filename = `annotations-${imageName
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(filename);
}

/**
 * Capture a zoomed snippet of the annotation location
 */
async function captureAnnotationSnippet(
  viewer: any,
  annotation: Annotation,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Get current viewport state to restore later
      const originalZoom = viewer.viewport.getZoom();
      const originalCenter = viewer.viewport.getCenter();

      // Use the stored zoom level from when annotation was created
      // If not available, fall back to a reasonable default
      const targetZoom =
        annotation.zoomLevel || viewer.viewport.getMaxZoom() * 0.3;

      console.log(
        `Using zoom level: ${targetZoom} for annotation: ${
          annotation.text || annotation.id
        }`
      );

      // Create viewport point for annotation
      const viewportPoint = new window.OpenSeadragon.Point(
        annotation.x,
        annotation.y
      );

      // Pan to annotation point FIRST (center it)
      viewer.viewport.panTo(viewportPoint, false);

      // Then zoom to target level with the annotation point as center
      viewer.viewport.zoomTo(targetZoom, viewportPoint, false);

      // Force immediate update
      viewer.forceRedraw();

      // Wait for tiles to fully load
      let tilesLoaded = 0;
      let timeoutId: any;
      let checkInterval: any;

      const onTileLoaded = () => {
        tilesLoaded++;
      };

      const captureCanvas = () => {
        try {
          const canvas = viewer.drawer.canvas;

          if (!canvas) {
            throw new Error("Canvas not found");
          }

          // Verify the annotation point is at the center of the viewport
          const currentCenter = viewer.viewport.getCenter();
          const currentZoom = viewer.viewport.getZoom();
          console.log(`Annotation point: ${annotation.x}, ${annotation.y}`);
          console.log(`Current center: ${currentCenter.x}, ${currentCenter.y}`);
          console.log(
            `Current zoom: ${currentZoom}, Target zoom: ${targetZoom}`
          );

          // If not centered or not at correct zoom, re-apply
          if (
            Math.abs(currentCenter.x - annotation.x) > 0.001 ||
            Math.abs(currentCenter.y - annotation.y) > 0.001 ||
            Math.abs(currentZoom - targetZoom) > 0.01
          ) {
            console.log("Re-centering and re-zooming annotation point...");
            viewer.viewport.panTo(viewportPoint, false);
            viewer.viewport.zoomTo(targetZoom, viewportPoint, false);
            viewer.forceRedraw();

            // Wait a bit more for the adjustment
            setTimeout(() => {
              captureCanvas();
            }, 100);
            return;
          }

          // Create a new canvas for the snippet
          const snippetCanvas = document.createElement("canvas");
          snippetCanvas.width = width;
          snippetCanvas.height = height;
          const ctx = snippetCanvas.getContext("2d");

          if (!ctx) {
            throw new Error("Could not get canvas context");
          }

          // Since annotation is centered in viewport, crop from canvas center
          const sourceX = (canvas.width - width) / 2;
          const sourceY = (canvas.height - height) / 2;

          console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
          console.log(`Crop from center: ${sourceX}, ${sourceY}`);

          // Draw the cropped section from canvas center
          ctx.drawImage(
            canvas,
            Math.max(0, sourceX),
            Math.max(0, sourceY),
            Math.min(width, canvas.width),
            Math.min(height, canvas.height),
            0,
            0,
            width,
            height
          );

          // Draw a small crosshair at center to mark annotation point
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          const centerX = width / 2;
          const centerY = height / 2;
          const crossSize = 10;

          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(centerX - crossSize, centerY);
          ctx.lineTo(centerX + crossSize, centerY);
          ctx.stroke();

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - crossSize);
          ctx.lineTo(centerX, centerY + crossSize);
          ctx.stroke();

          // Draw circle around center
          ctx.beginPath();
          ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
          ctx.stroke();

          // Convert to data URL
          const dataUrl = snippetCanvas.toDataURL("image/png");

          // Restore original viewport
          viewer.viewport.panTo(originalCenter, false);
          viewer.viewport.zoomTo(originalZoom, null, false);

          resolve(dataUrl);
        } catch (error) {
          // Restore viewport even on error
          viewer.viewport.panTo(originalCenter, false);
          viewer.viewport.zoomTo(originalZoom, null, false);
          reject(error);
        }
      };

      const captureAfterLoad = () => {
        try {
          // Remove event listener
          viewer.removeHandler("tile-loaded", onTileLoaded);
          if (timeoutId) clearTimeout(timeoutId);
          if (checkInterval) clearInterval(checkInterval);

          // Force one more redraw before capture
          viewer.forceRedraw();

          // Small delay to ensure redraw completes
          setTimeout(() => {
            captureCanvas();
          }, 200);
        } catch (error) {
          // Restore viewport even on error
          viewer.viewport.panTo(originalCenter, false);
          viewer.viewport.zoomTo(originalZoom, null, false);
          reject(error);
        }
      };

      // Listen for tile-loaded events
      viewer.addHandler("tile-loaded", onTileLoaded);

      // Set a timeout to capture even if not all tiles load
      timeoutId = setTimeout(() => {
        console.log(`Captured after timeout. Tiles loaded: ${tilesLoaded}`);
        captureAfterLoad();
      }, 2000); // Increased to 2 seconds

      // Also capture after a minimum number of tiles have loaded
      checkInterval = setInterval(() => {
        if (tilesLoaded >= 6) {
          // Increased to 6 tiles for better quality
          console.log(`Captured after ${tilesLoaded} tiles loaded`);
          captureAfterLoad();
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}
