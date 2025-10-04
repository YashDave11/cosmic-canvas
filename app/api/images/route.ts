import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDziUrl, getThumbnailUrl, TILES_CONFIG } from "@/lib/tiles-config";

// Configuration - Load from public/TIFF_tiles or cloud storage
const TIFF_TILES_DIR = path.join(process.cwd(), "public", "TIFF_tiles");
const METADATA_FILE = path.join(TIFF_TILES_DIR, "images-metadata.json");

export async function GET() {
  try {
    const allImages: any[] = [];

    // Load TIFF images from public/TIFF_tiles
    if (fs.existsSync(METADATA_FILE)) {
      const metadataContent = fs.readFileSync(METADATA_FILE, "utf-8");
      const metadata = JSON.parse(metadataContent);

      const tiffImages = metadata.map((img: any) => ({
        id: img.id || img.name,
        name: img.name || img.id,
        dziUrl: `/TIFF_tiles/${img.id}/${img.id}.dzi`,
        thumbnailUrl: `/TIFF_tiles/${img.id}/${img.id}_thumb.jpg`,
        description: `${img.width}×${img.height} pixels`,
        size: `${((img.width * img.height) / 1000000).toFixed(0)} MP`,
        levels: img.levels || 0,
        format: img.format || "tiff",
        generatedAt: img.generatedAt,
        source: "tiff", // Mark as TIFF
      }));

      allImages.push(...tiffImages);
      console.log(`✅ Loaded ${tiffImages.length} TIFF images`);
    }

    // Add legacy JPEG image (from public/tiles/)
    const legacyImages = [
      {
        id: "andromeda-galaxy",
        name: "Holiday wishes from the Hubble Space Telescope",
        dziUrl: "/tiles/andromeda-galaxy.dzi",
        thumbnailUrl: "/spiral-galaxy-deep-space.jpg",
        description: "Hubble Space Telescope mosaic - 42,208×9,870 pixels",
        size: "417 MP",
        levels: 17,
        format: "jpeg",
        source: "local", // Mark as local
      },
    ];

    // Check if local tiles exist before adding
    for (const img of legacyImages) {
      const dziPath = path.join(
        process.cwd(),
        "public",
        img.dziUrl.replace(/^\//, "")
      );
      if (fs.existsSync(dziPath)) {
        allImages.push(img);
      }
    }

    return NextResponse.json({
      success: true,
      count: allImages.length,
      images: allImages,
    });
  } catch (error: any) {
    console.error("Error loading images:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        images: [],
      },
      { status: 500 }
    );
  }
}
