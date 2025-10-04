// Annotation data structures and storage utilities

export interface Annotation {
  id: string;
  imageId: string;
  x: number; // Viewport X coordinate (0-1)
  y: number; // Viewport Y coordinate (0-1)
  text: string;
  timestamp: number;
  color: string; // Hex color for the pin
  zoomLevel?: number; // Zoom level when annotation was created
}

interface AnnotationStorage {
  [imageId: string]: Annotation[];
}

const STORAGE_KEY = "cosmic-canvas-annotations";

/**
 * Get all annotations for a specific image
 */
export function getAnnotations(imageId: string): Annotation[] {
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    if (!storage) return [];

    const data: AnnotationStorage = JSON.parse(storage);
    return data[imageId] || [];
  } catch (error) {
    console.error("Error loading annotations:", error);
    return [];
  }
}

/**
 * Save annotations for a specific image
 */
export function saveAnnotations(
  imageId: string,
  annotations: Annotation[]
): boolean {
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    const data: AnnotationStorage = storage ? JSON.parse(storage) : {};

    data[imageId] = annotations;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving annotations:", error);
    return false;
  }
}

/**
 * Add a new annotation
 */
export function addAnnotation(
  imageId: string,
  x: number,
  y: number,
  text: string = "",
  color: string = "#3b82f6",
  zoomLevel?: number
): Annotation {
  const annotation: Annotation = {
    id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    imageId,
    x,
    y,
    text,
    timestamp: Date.now(),
    color,
    zoomLevel,
  };

  const annotations = getAnnotations(imageId);
  annotations.push(annotation);
  saveAnnotations(imageId, annotations);

  return annotation;
}

/**
 * Update an existing annotation
 */
export function updateAnnotation(
  imageId: string,
  annotationId: string,
  updates: Partial<Omit<Annotation, "id" | "imageId" | "timestamp">>
): boolean {
  try {
    const annotations = getAnnotations(imageId);
    const index = annotations.findIndex((a) => a.id === annotationId);

    if (index === -1) return false;

    annotations[index] = {
      ...annotations[index],
      ...updates,
    };

    return saveAnnotations(imageId, annotations);
  } catch (error) {
    console.error("Error updating annotation:", error);
    return false;
  }
}

/**
 * Delete an annotation
 */
export function deleteAnnotation(
  imageId: string,
  annotationId: string
): boolean {
  try {
    const annotations = getAnnotations(imageId);
    const filtered = annotations.filter((a) => a.id !== annotationId);

    if (filtered.length === annotations.length) return false; // Not found

    return saveAnnotations(imageId, filtered);
  } catch (error) {
    console.error("Error deleting annotation:", error);
    return false;
  }
}

/**
 * Delete all annotations for an image
 */
export function clearAnnotations(imageId: string): boolean {
  try {
    return saveAnnotations(imageId, []);
  } catch (error) {
    console.error("Error clearing annotations:", error);
    return false;
  }
}

/**
 * Get annotation count for an image
 */
export function getAnnotationCount(imageId: string): number {
  return getAnnotations(imageId).length;
}

/**
 * Validate annotation text
 */
export function validateAnnotationText(text: string): {
  valid: boolean;
  error?: string;
} {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Annotation text cannot be empty" };
  }

  if (text.length > 500) {
    return {
      valid: false,
      error: "Annotation text is too long (max 500 characters)",
    };
  }

  // Check for potentially dangerous content
  if (/<script|<iframe|javascript:/i.test(text)) {
    return { valid: false, error: "Invalid characters in annotation text" };
  }

  return { valid: true };
}

/**
 * Export annotations as JSON
 */
export function exportAnnotations(imageId: string): string {
  const annotations = getAnnotations(imageId);
  return JSON.stringify(annotations, null, 2);
}

/**
 * Import annotations from JSON
 */
export function importAnnotations(imageId: string, jsonData: string): boolean {
  try {
    const annotations: Annotation[] = JSON.parse(jsonData);

    // Validate structure
    if (!Array.isArray(annotations)) {
      throw new Error("Invalid format: expected array");
    }

    // Validate each annotation
    for (const annotation of annotations) {
      if (
        !annotation.id ||
        typeof annotation.x !== "number" ||
        typeof annotation.y !== "number" ||
        typeof annotation.text !== "string"
      ) {
        throw new Error("Invalid annotation structure");
      }
    }

    return saveAnnotations(imageId, annotations);
  } catch (error) {
    console.error("Error importing annotations:", error);
    return false;
  }
}
