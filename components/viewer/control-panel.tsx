"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Home,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Pin,
  ArrowLeft,
  Info,
  Search,
  X,
} from "lucide-react";

interface ControlButton {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  tooltip: string;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
}

interface ControlPanelProps {
  viewer: any; // OpenSeadragon viewer instance
  imageName: string;
  onBack: () => void;
  annotationCount: number;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  isFullscreen?: boolean;
}

export function ControlPanel({
  viewer,
  imageName,
  onBack,
  annotationCount,
  showAnnotations,
  onToggleAnnotations,
  isFullscreen = false,
}: ControlPanelProps) {
  const [showCoordinateSearch, setShowCoordinateSearch] = useState(false);
  const [xCoord, setXCoord] = useState("");
  const [yCoord, setYCoord] = useState("");
  const [error, setError] = useState("");

  // Control actions
  const handleZoomIn = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom();
      viewer.viewport.zoomTo(currentZoom * 1.5);
    }
  };

  const handleZoomOut = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom();
      viewer.viewport.zoomTo(currentZoom / 1.5);
    }
  };

  const handleResetView = () => {
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

  const handleCoordinateSearch = () => {
    setError("");

    // Parse coordinates
    const x = parseFloat(xCoord);
    const y = parseFloat(yCoord);

    // Validate coordinates
    if (isNaN(x) || isNaN(y)) {
      setError("Please enter valid decimal numbers");
      return;
    }

    if (x < 0 || x > 1 || y < 0 || y > 1) {
      setError("Coordinates must be between 0 and 1");
      return;
    }

    // Navigate to coordinates
    if (viewer) {
      const viewportPoint = new window.OpenSeadragon.Point(x, y);

      // Pan to the point
      viewer.viewport.panTo(viewportPoint, true);

      // Zoom to a good level for viewing
      const targetZoom = viewer.viewport.getMaxZoom() * 0.4;
      viewer.viewport.zoomTo(targetZoom, viewportPoint, true);

      console.log(`Navigated to coordinates: X=${x}, Y=${y}`);

      // Close modal after successful navigation
      setShowCoordinateSearch(false);
      setXCoord("");
      setYCoord("");
    }
  };

  const handleCloseCoordinateSearch = () => {
    setShowCoordinateSearch(false);
    setXCoord("");
    setYCoord("");
    setError("");
  };

  // Define control buttons
  const controlButtons: ControlButton[] = [
    {
      id: "zoom-in",
      icon: ZoomIn,
      label: "Zoom In",
      action: handleZoomIn,
      tooltip: "Zoom in (+)",
      variant: "outline",
      disabled: !viewer,
    },
    {
      id: "zoom-out",
      icon: ZoomOut,
      label: "Zoom Out",
      action: handleZoomOut,
      tooltip: "Zoom out (-)",
      variant: "outline",
      disabled: !viewer,
    },
    {
      id: "reset",
      icon: Home,
      label: "Reset",
      action: handleResetView,
      tooltip: "Reset view (0)",
      variant: "outline",
      disabled: !viewer,
    },
    {
      id: "rotate-left",
      icon: RotateCcw,
      label: "Rotate Left",
      action: handleRotateLeft,
      tooltip: "Rotate left (Shift+R)",
      variant: "outline",
      disabled: !viewer,
    },
    {
      id: "rotate-right",
      icon: RotateCw,
      label: "Rotate Right",
      action: handleRotateRight,
      tooltip: "Rotate right (R)",
      variant: "outline",
      disabled: !viewer,
    },
    {
      id: "fullscreen",
      icon: isFullscreen ? Minimize : Maximize,
      label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
      action: handleFullscreen,
      tooltip: "Toggle fullscreen (F)",
      variant: "outline",
      disabled: !viewer,
    },
  ];

  return (
    <>
      {/* Floating control panel with glass morphism */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
        <div className="glass-panel flex items-center gap-2 p-3 rounded-2xl shadow-2xl">
          {controlButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.id}
                onClick={button.action}
                disabled={button.disabled}
                className="control-button group relative"
                aria-label={button.tooltip}
                title={button.tooltip}
              >
                <Icon className="w-5 h-5" />

                {/* Tooltip */}
                <div className="tooltip">{button.tooltip}</div>
              </button>
            );
          })}

          {/* Divider */}
          <div className="h-8 w-px bg-border/30 mx-1" />

          {/* Annotation toggle button */}
          <button
            onClick={onToggleAnnotations}
            className={`control-button group relative ${
              showAnnotations ? "active" : ""
            }`}
            aria-label={`${showAnnotations ? "Hide" : "Show"} annotations`}
            title="Toggle annotations (A)"
          >
            <Pin className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              {annotationCount}
            </span>

            {/* Tooltip */}
            <div className="tooltip">Toggle annotations (A)</div>
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-border/30 mx-1" />

          {/* Coordinate search button */}
          <button
            onClick={() => setShowCoordinateSearch(true)}
            className="control-button group relative"
            aria-label="Search by coordinates"
            title="Search by coordinates"
          >
            <Info className="w-5 h-5" />

            {/* Tooltip */}
            <div className="tooltip">Search by coordinates</div>
          </button>
        </div>
      </div>

      {/* Coordinate Search Modal */}
      {showCoordinateSearch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="coordinate-modal glass-panel p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Navigate to Coordinates
              </h3>
              <button
                onClick={handleCloseCoordinateSearch}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-white/70 mb-4">
              Enter viewport coordinates (0-1 range) to navigate to a specific
              location in the image.
            </p>

            {/* Input fields */}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  X Coordinate
                </label>
                <input
                  type="text"
                  value={xCoord}
                  onChange={(e) => setXCoord(e.target.value)}
                  placeholder="e.g., 0.270560"
                  className="coordinate-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCoordinateSearch();
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Y Coordinate
                </label>
                <input
                  type="text"
                  value={yCoord}
                  onChange={(e) => setYCoord(e.target.value)}
                  placeholder="e.g., 0.058141"
                  className="coordinate-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCoordinateSearch();
                    }
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCoordinateSearch}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <Search className="w-4 h-4" />
                Navigate
              </button>
              <button
                onClick={handleCloseCoordinateSearch}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }

        .control-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .control-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .control-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        .control-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .control-button.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        .tooltip {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5rem 0.75rem;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 100;
        }

        .control-button:hover .tooltip {
          opacity: 1;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        /* Responsive adjustments */
        .coordinate-modal {
          animation: modal-appear 0.2s ease-out;
        }

        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .coordinate-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .coordinate-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .coordinate-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 640px) {
          .glass-panel {
            flex-wrap: wrap;
            max-width: 90vw;
          }

          .control-button {
            padding: 0.625rem;
          }
        }
      `}</style>
    </>
  );
}
