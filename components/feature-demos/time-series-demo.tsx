"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function TimeSeriesDemo() {
  const [position, setPosition] = useState([50])

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <div className="relative w-full h-full">
          <img src="/glacier-ice-before-melting.jpg" alt="Before" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position[0]}% 0 0)` }}>
            <img src="/glacier-ice-after-melting.jpg" alt="After" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg shadow-primary/50"
            style={{ left: `${position[0]}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full border-4 border-background" />
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded text-xs font-mono">
          2020
        </div>
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded text-xs font-mono">
          2024
        </div>
      </div>
      <Slider value={position} onValueChange={setPosition} max={100} step={1} className="w-full" />
      <p className="text-sm text-muted-foreground text-center">
        Drag the slider to compare images across time and track environmental changes
      </p>
    </div>
  )
}
