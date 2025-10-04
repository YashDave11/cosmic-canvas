"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"

export function DeepZoomDemo() {
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <img
          src="/spiral-galaxy-deep-space.jpg"
          alt="Galaxy zoom demonstration"
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-background/80 backdrop-blur px-3 py-2 rounded-lg text-sm font-mono">
            Zoom: {zoomLevel}x
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleZoomOut} disabled={zoomLevel === 1}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleZoomIn} disabled={zoomLevel === 4}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Experience smooth, cinematic zooming from galaxy-wide to star cluster detail
      </p>
    </div>
  )
}
