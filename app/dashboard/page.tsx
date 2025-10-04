"use client";

import { TileImageSearch } from "@/components/dashboard/tile-image-search";
import { Navigation } from "@/components/navigation";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 h-screen flex flex-col">
        {/* Search Header */}
        <div className="border-b border-border/20 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <TileImageSearch />
          </div>
        </div>

        {/* Main Content - Images will be displayed by TileImageSearch component */}
        <div className="flex-1 overflow-auto">
          {/* Content is handled by TileImageSearch component above */}
        </div>
      </div>
    </div>
  );
}
