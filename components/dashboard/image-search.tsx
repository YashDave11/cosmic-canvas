"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

// Mock NASA images data - replace with real API later
const mockImages = [
  {
    id: "1",
    title: "Carina Nebula",
    url: "/nebula-space-cosmic-background.jpg",
    description: "A stellar nursery in the constellation Carina",
    tags: ["nebula", "stars", "cosmic"],
  },
  {
    id: "2",
    title: "Mars Surface",
    url: "/mars-surface-terrain.jpg",
    description: "Detailed view of Martian landscape",
    tags: ["mars", "planet", "surface"],
  },
  {
    id: "3",
    title: "Spiral Galaxy",
    url: "/spiral-galaxy-deep-space.jpg",
    description: "Deep space spiral galaxy formation",
    tags: ["galaxy", "spiral", "deep space"],
  },
  {
    id: "4",
    title: "Mars Planet Map",
    url: "/mars-planet-surface-map.jpg",
    description: "Topographical mapping of Mars surface",
    tags: ["mars", "mapping", "topography"],
  },
];

interface ImageSearchProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ImageSearch({ onImageSelect }: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState(mockImages);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredImages(mockImages);
      setShowResults(true);
      return;
    }

    const filtered = mockImages.filter(
      (image) =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    setFilteredImages(filtered);
    setShowResults(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cosmic images... (e.g., nebula, mars, galaxy)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-background/50 border-border/30 focus:border-primary/50"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" className="border-border/30">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">
              Found {filteredImages.length} images
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResults(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => {
                  onImageSelect(image.url);
                  setShowResults(false);
                }}
                className="group cursor-pointer bg-card/50 rounded-lg overflow-hidden border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-2">
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {image.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
