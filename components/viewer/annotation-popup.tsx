"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Annotation } from "@/lib/annotations";
import { Button } from "@/components/ui/button";

interface AnnotationPopupProps {
  annotation: Annotation | null;
  onSave: (annotationId: string, text: string) => void;
  onDelete: (annotationId: string) => void;
  onClose: () => void;
}

export function AnnotationPopup({
  annotation,
  onSave,
  onDelete,
  onClose,
}: AnnotationPopupProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (annotation) {
      setText(annotation.text);
      // Focus textarea after a short delay to ensure it's rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [annotation]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!annotation) return null;

  const handleSave = () => {
    if (!text.trim()) {
      setError("Please enter some text for the annotation");
      return;
    }

    if (text.length > 500) {
      setError("Annotation text is too long (max 500 characters)");
      return;
    }

    onSave(annotation.id, text);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this annotation?")) {
      onDelete(annotation.id);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="annotation-backdrop"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close annotation popup"
      />

      {/* Popup */}
      <div className="annotation-popup" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="popup-header">
          <h3 className="popup-title">Edit Annotation</h3>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="popup-content">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Give this annotation a name or description..."
            className="annotation-textarea"
            rows={4}
            maxLength={500}
            aria-label="Annotation text"
          />

          {error && <div className="error-message">{error}</div>}

          <div className="character-count">{text.length} / 500 characters</div>
        </div>

        {/* Footer */}
        <div className="popup-footer">
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="delete-button"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="save-button">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="popup-hint">
          Press <kbd>Ctrl+Enter</kbd> to save, <kbd>Esc</kbd> to close
        </div>
      </div>

      <style jsx>{`
        .annotation-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 100;
          animation: fade-in 0.2s ease-out;
        }

        .annotation-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          z-index: 101;
          animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .popup-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .popup-content {
          padding: 24px;
        }

        .annotation-textarea {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          line-height: 1.5;
          resize: vertical;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .annotation-textarea:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .annotation-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .error-message {
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          color: #fca5a5;
          font-size: 13px;
        }

        .character-count {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-align: right;
        }

        .popup-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .delete-button {
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .delete-button:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .save-button {
          background: rgba(59, 130, 246, 0.8);
        }

        .save-button:hover {
          background: rgba(59, 130, 246, 1);
        }

        .popup-hint {
          padding: 12px 24px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .popup-hint kbd {
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-family: monospace;
          font-size: 11px;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .annotation-popup {
            width: 95%;
            max-width: none;
          }

          .popup-header,
          .popup-content,
          .popup-footer {
            padding: 16px;
          }

          .popup-footer {
            flex-direction: column;
            gap: 12px;
          }

          .popup-footer > * {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
