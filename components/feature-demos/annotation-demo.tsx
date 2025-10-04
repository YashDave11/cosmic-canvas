"use client"

import { useState } from "react"

const annotations = [
  { id: 1, x: 30, y: 40, label: "Olympus Mons", description: "Largest volcano in solar system" },
  { id: 2, x: 60, y: 55, label: "Valles Marineris", description: "Massive canyon system" },
  { id: 3, x: 45, y: 70, label: "Polar Ice Cap", description: "Water ice deposit" },
]

export function AnnotationDemo() {
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <img src="/mars-surface-terrain.jpg" alt="Mars with annotations" className="w-full h-full object-cover" />
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute cursor-pointer"
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
            onMouseEnter={() => setActiveAnnotation(annotation.id)}
            onMouseLeave={() => setActiveAnnotation(null)}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border-2 border-primary rounded-full animate-ping" />
              {activeAnnotation === annotation.id && (
                <div className="absolute left-6 top-0 bg-background/95 backdrop-blur border border-border rounded-lg p-3 w-48 z-10 shadow-xl">
                  <h4 className="font-semibold text-sm mb-1">{annotation.label}</h4>
                  <p className="text-xs text-muted-foreground">{annotation.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Hover over markers to see community annotations and discoveries
      </p>
    </div>
  )
}
