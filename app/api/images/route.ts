import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Configuration
const TILES_DIR = "E:\\NASA_TILES";
const METADATA_FILE = path.join(TILES_DIR, "images-metadata.json");

export async function GET() {
  try {
    const allImages: any[] = [];

    // Load images from E:\NASA_TILES (new system)
    if (fs.existsSync(METADATA_FILE)) {
      const metadataContent = fs.readFileSync(METADATA_FILE, "utf-8");
      const metadata = JSON.parse(metadataContent);

      const externalImages = metadata.map((img: any) => ({
        id: img.id || img.name,
        name: img.name || img.id,
        dziUrl: `/api/tiles/${img.id}/${img.id}.dzi`,
        thumbnailUrl: `/api/tiles/${img.id}/${img.id}_thumb.jpg`,
        description: `${img.width}×${img.height} pixels`,
        size: `${((img.width * img.height) / 1000000).toFixed(0)} MP`,
        levels: img.levels || 0,
        format: img.format || "unknown",
        generatedAt: img.generatedAt,
        source: "external", // Mark as external
      }));

      allImages.push(...externalImages);
    }

    // Add legacy local images (from public/tiles/)
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
