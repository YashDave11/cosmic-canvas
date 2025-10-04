"use client";

import { useState } from "react";
import { Annotation } from "@/lib/annotations";

interface AnnotationPinProps {
  annotation: Annotation;
  onClick: (annotation: Annotation) => void;
  scale?: number;
}

export function AnnotationPin({
  annotation,
  onClick,
  scale = 1,
}: AnnotationPinProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(annotation);
  };

  return (
    <>
      <div
        className="annotation-pin"
        style={{
          backgroundColor: annotation.color,
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`Annotation: ${annotation.text || "No text"}`}
      >
        {/* Pin pulse animation */}
        <div className="pin-pulse" style={{ borderColor: annotation.color }} />

        {/* Hover preview */}
        {isHovered && annotation.text && (
          <div className="pin-preview">
            <div className="preview-content">{annotation.text}</div>
            <div className="preview-arrow" />
          </div>
        )}
      </div>

      <style jsx>{`
        .annotation-pin {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5),
            0 0 0 2px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .annotation-pin:hover {
          transform: scale(1.3);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6),
            0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .annotation-pin:active {
          transform: scale(1.1);
        }

        .pin-pulse {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid;
          opacity: 0;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }

        .pin-preview {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 100;
          animation: fade-in 0.2s ease-out;
        }

        .preview-content {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: white;
          white-space: nowrap;
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        .preview-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid rgba(0, 0, 0, 0.95);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .annotation-pin {
            width: 20px;
            height: 20px;
            border-width: 2px;
          }

          .preview-content {
            font-size: 12px;
            padding: 6px 10px;
            max-width: 200px;
          }
        }
      `}</style>
    </>
  );
}
