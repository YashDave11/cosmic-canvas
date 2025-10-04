import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Configuration
const TILES_DIR = "E:\\NASA_TILES";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string; path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const { imageId, path: filePath } = resolvedParams;

    // Construct full file path - files are in TILES_DIR/imageId/
    const fullPath = path.join(TILES_DIR, imageId, ...filePath);

    // Security check - ensure path is within TILES_DIR
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(path.normalize(TILES_DIR))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath);

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".dzi":
        contentType = "application/xml";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".xml":
        contentType = "application/xml";
        break;
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Error serving tile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
