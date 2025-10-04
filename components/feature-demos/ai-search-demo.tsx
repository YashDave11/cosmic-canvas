"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"

const searchResults = [
  { x: 35, y: 45, confidence: 95 },
  { x: 65, y: 60, confidence: 87 },
]

export function AISearchDemo() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    if (query.trim()) {
      setShowResults(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Try: 'dust storm on Mars'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-background border-border"
          />
        </div>
        <Button onClick={handleSearch} className="bg-primary text-primary-foreground">
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <img src="/mars-planet-surface-map.jpg" alt="Mars surface map" className="w-full h-full object-cover" />
        {showResults &&
          searchResults.map((result, index) => (
            <div
              key={index}
              className="absolute animate-pulse-glow"
              style={{ left: `${result.x}%`, top: `${result.y}%` }}
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-primary rounded-lg -translate-x-1/2 -translate-y-1/2 bg-primary/20" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
                  {result.confidence}% match
                </div>
              </div>
            </div>
          ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Use natural language to find specific features across massive datasets
      </p>
    </div>
  )
}
