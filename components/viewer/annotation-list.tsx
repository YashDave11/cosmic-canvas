"use client";

import { useState } from "react";
import { Annotation } from "@/lib/annotations";
import { X, MapPin, ChevronRight, Trash2, List, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAnnotationsToPDF } from "@/lib/export-annotations-pdf";

interface AnnotationListProps {
  annotations: Annotation[];
  onAnnotationClick: (annotation: Annotation) => void;
  onAnnotationDelete: (annotationId: string) => void;
  onAnnotationEdit: (annotation: Annotation) => void;
  isVisible: boolean;
  onToggle: () => void;
  viewer: any; // OpenSeadragon viewer instance
  imageName: string;
}

export function AnnotationList({
  annotations,
  onAnnotationClick,
  onAnnotationDelete,
  onAnnotationEdit,
  isVisible,
  onToggle,
  viewer,
  imageName,
}: AnnotationListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (annotations.length === 0) {
      alert("No annotations to export");
      return;
    }

    setIsExporting(true);
    try {
      await exportAnnotationsToPDF({
        imageName,
        annotations,
        viewer,
      });
      console.log("✅ PDF exported successfully");
    } catch (error: any) {
      console.error("❌ Error exporting PDF:", error);
      alert(`Failed to export PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isVisible) {
    // Collapsed button
    return (
      <button
        onClick={onToggle}
        className="annotation-list-toggle"
        aria-label="Show annotations list"
      >
        <List className="w-5 h-5" />
        <span className="ml-2 font-medium">{annotations.length}</span>

        <style jsx>{`
          .annotation-list-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 45;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          }

          .annotation-list-toggle:hover {
            background: rgba(0, 0, 0, 0.9);
            border-color: rgba(59, 130, 246, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
          }
        `}</style>
      </button>
    );
  }

  return (
    <>
      <div className="annotation-list-panel">
        {/* Header */}
        <div className="list-header">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="list-title">Annotations</h3>
            <span className="annotation-count">{annotations.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting || annotations.length === 0}
              className="export-button"
              aria-label="Export annotations to PDF"
              title="Export to PDF"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="close-button"
              aria-label="Close annotations list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="list-content">
          {annotations.length === 0 ? (
            <div className="empty-state">
              <MapPin className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No annotations yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Right-click on the image to add one
              </p>
            </div>
          ) : (
            <div className="annotations-list">
              {annotations.map((annotation, index) => (
                <div
                  key={annotation.id}
                  className={`annotation-item ${
                    hoveredId === annotation.id ? "hovered" : ""
                  }`}
                  onMouseEnter={() => setHoveredId(annotation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Annotation number and color */}
                  <div
                    className="annotation-marker"
                    style={{ backgroundColor: annotation.color }}
                  >
                    {index + 1}
                  </div>

                  {/* Annotation content */}
                  <div
                    className="annotation-content"
                    onClick={() => onAnnotationClick(annotation)}
                  >
                    <p className="annotation-text">
                      {annotation.text || "No description"}
                    </p>
                    <p className="annotation-coords">
                      {(annotation.x * 100).toFixed(1)}%,{" "}
                      {(annotation.y * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="annotation-actions">
                    <button
                      onClick={() => onAnnotationEdit(annotation)}
                      className="action-button edit"
                      aria-label="Edit annotation"
                      title="Edit"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            "Are you sure you want to delete this annotation?"
                          )
                        ) {
                          onAnnotationDelete(annotation.id);
                        }
                      }}
                      className="action-button delete"
                      aria-label="Delete annotation"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="list-footer">
          <p className="text-xs text-muted-foreground">
            Click an annotation to zoom to it
          </p>
        </div>
      </div>

      <style jsx>{`
        .annotation-list-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          max-height: calc(100vh - 120px);
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          z-index: 45;
          display: flex;
          flex-direction: column;
          animation: slide-in 0.3s ease-out;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .list-title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .annotation-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #60a5fa;
        }

        .export-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #60a5fa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-button:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
          color: #93c5fd;
        }

        .export-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .list-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .list-content::-webkit-scrollbar {
          width: 6px;
        }

        .list-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .list-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .list-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .annotations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .annotation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .annotation-item:hover,
        .annotation-item.hovered {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateX(-4px);
        }

        .annotation-marker {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid white;
          font-size: 12px;
          font-weight: 600;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .annotation-content {
          flex: 1;
          min-width: 0;
        }

        .annotation-text {
          font-size: 13px;
          color: white;
          margin: 0 0 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .annotation-coords {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-family: monospace;
        }

        .annotation-actions {
          display: flex;
          gap: 4px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .action-button.delete:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .list-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .annotation-list-panel {
            width: calc(100vw - 40px);
            max-height: calc(100vh - 160px);
          }
        }
      `}</style>
    </>
  );
}
