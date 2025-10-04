import { NextRequest, NextResponse } from "next/server";

/**
 * API Route for serving tiles from Cloudflare R2
 *
 * This route proxies requests to R2 storage, allowing tiles to be served
 * from cloud storage instead of local file system.
 *
 * URL Pattern: /api/tiles-r2/[imageId]/[...path]
 * Example: /api/tiles-r2/heic1502a/12/5_3.jpg
 */

const R2_BASE_URL = process.env.NEXT_PUBLIC_TILES_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string; path: string[] }> }
) {
  try {
    const { imageId, path: pathSegments } = await params;

    if (!R2_BASE_URL) {
      return NextResponse.json(
        { error: "R2 base URL not configured" },
        { status: 500 }
      );
    }

    // Construct the full path
    const filePath = pathSegments.join("/");
    const r2Url = `${R2_BASE_URL}/${imageId}/${filePath}`;

    console.log(`Fetching from R2: ${r2Url}`);

    // Fetch from R2
    const response = await fetch(r2Url, {
      // Cache for 1 year (tiles never change)
      next: { revalidate: 31536000 },
    });

    if (!response.ok) {
      console.error(
        `R2 fetch failed: ${response.status} ${response.statusText}`
      );
      return NextResponse.json({ error: "Tile not found" }, { status: 404 });
    }

    // Get the content type
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Stream the response
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error serving tile from R2:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
