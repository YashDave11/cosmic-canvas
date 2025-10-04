import { NextResponse } from "next/server";

/**
 * API Route for loading image metadata from Cloudflare R2
 *
 * This route fetches the images-metadata.json file from R2 storage
 * and returns the list of available images.
 */

const R2_BASE_URL = process.env.NEXT_PUBLIC_TILES_BASE_URL;
const USE_LOCAL_TILES = process.env.NEXT_PUBLIC_USE_LOCAL_TILES === "true";

export async function GET() {
  try {
    const allImages: any[] = [];

    // Load from R2 if configured
    if (R2_BASE_URL && !USE_LOCAL_TILES) {
      console.log("Loading images from R2...");

      const metadataUrl = `${R2_BASE_URL}/images-metadata.json`;
      const response = await fetch(metadataUrl, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (response.ok) {
        const metadata = await response.json();

        const r2Images = metadata.map((img: any) => ({
          id: img.id || img.name,
          name: img.name || img.id,
          dziUrl: `/api/tiles-r2/${img.id}/${img.id}.dzi`,
          thumbnailUrl: `/api/tiles-r2/${img.id}/${img.id}_thumb.jpg`,
          description: `${img.width}×${img.height} pixels`,
          size: `${((img.width * img.height) / 1000000).toFixed(0)} MP`,
          levels: img.levels || 0,
          format: img.format || "unknown",
          generatedAt: img.generatedAt,
          source: "r2",
        }));

        allImages.push(...r2Images);
        console.log(`✅ Loaded ${r2Images.length} images from R2`);
      } else {
        console.warn(`⚠️  Failed to load metadata from R2: ${response.status}`);
      }
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
        source: "local",
      },
    ];

    // Only add local images if they exist or if using local tiles
    if (USE_LOCAL_TILES) {
      allImages.push(...legacyImages);
      console.log(`✅ Added ${legacyImages.length} local images`);
    }

    return NextResponse.json({
      success: true,
      count: allImages.length,
      images: allImages,
      source: R2_BASE_URL ? "r2" : "local",
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
