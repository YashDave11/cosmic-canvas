"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Layers } from "lucide-react";

interface TileImage {
  id: string;
  name: string;
  dziUrl: string;
  thumbnailUrl: string;
  description: string;
  size: string;
  levels: number;
}

interface TileImageSearchProps {
  onImageSelect?: (image: { dziUrl: string; name: string }) => void;
}

export function TileImageSearch({ onImageSelect }: TileImageSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableImages, setAvailableImages] = useState<TileImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<TileImage[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Scan for available DZI files
  const scanForTiles = async () => {
    setIsScanning(true);
    try {
      // Fetch images from API
      const response = await fetch("/api/images");
      const data = await response.json();

      if (data.success && data.images) {
        console.log(`✅ Loaded ${data.images.length} images from API`);
        setAvailableImages(data.images);
        setFilteredImages(data.images);
      } else {
        console.warn("⚠️ No images found or API error:", data.message);
        setAvailableImages([]);
        setFilteredImages([]);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      setAvailableImages([]);
      setFilteredImages([]);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    scanForTiles();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredImages(availableImages);
      setShowResults(true);
      return;
    }

    const filtered = availableImages.filter(
      (image) =>
        image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredImages(filtered);
    setShowResults(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleImageSelect = (image: TileImage) => {
    // Navigate to dedicated viewer page
    const params = new URLSearchParams({
      dziUrl: image.dziUrl,
      name: image.name,
    });
    router.push(`/viewer/${image.id}?${params.toString()}`);

    // Also call the callback if provided (for backward compatibility)
    if (onImageSelect) {
      onImageSelect({
        dziUrl: image.dziUrl,
        name: image.name,
      });
    }
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tiled images... (e.g., nebula, galaxy, mars)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-background/50 border-border/30 focus:border-primary/50"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90"
          disabled={isScanning}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          variant="outline"
          className="border-border/30"
          onClick={scanForTiles}
          disabled={isScanning}
        >
          {isScanning ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Layers className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          {isScanning
            ? "Scanning for tiled images..."
            : `${availableImages.length} tiled images available`}
        </div>
        {availableImages.length === 0 && !isScanning && (
          <div className="text-xs text-muted-foreground bg-muted/20 rounded px-2 py-1">
            No tiles found. Generate some with:{" "}
            <code className="bg-background/50 px-1 rounded">
              node scripts/generate-tiles.js
            </code>
          </div>
        )}
      </div>

      {/* Image Gallery - Always show available images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            {showResults
              ? `Found ${filteredImages.length} images`
              : `Available Images (${availableImages.length})`}
          </h3>
          {showResults && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResults(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Search
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(showResults ? filteredImages : availableImages).map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageSelect(image)}
              className="group cursor-pointer bg-card/50 rounded-lg overflow-hidden border border-border/20 hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={image.thumbnailUrl}
                  alt={image.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-foreground">
                  <Layers className="w-3 h-3 inline mr-1" />
                  {image.levels} levels
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {image.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {image.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {image.size}
                  </span>
                  <span className="text-xs text-primary">Deep Zoom Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no images match search */}
        {filteredImages.length === 0 && showResults && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No images found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Empty state when no images available at all */}
        {availableImages.length === 0 && !isScanning && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">No images available</p>
            <p className="text-xs text-muted-foreground">
              Add images to E:\NASAimages\ and run the tile generation script
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
