const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Generate Deep Zoom Image (DZI) tiles from a large source image
 * Usage: node scripts/generate-tiles.js <input-image-path> [output-name]
 */

async function generateTiles(inputPath, outputName = "image") {
  try {
    console.log("🚀 Starting tile generation...");
    console.log(`📁 Input: ${inputPath}`);

    // Ensure input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Create output directories
    const outputDir = path.join("public", "tiles");
    const imageOutputDir = path.join(outputDir, outputName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Configure Sharp for large images
    sharp.cache(false);
    sharp.concurrency(1);

    // Get image metadata
    const metadata = await sharp(inputPath, {
      limitInputPixels: false,
      sequentialRead: true,
    }).metadata();
    console.log(`📊 Image info: ${metadata.width}x${metadata.height} pixels`);
    console.log(
      `📦 Format: ${metadata.format}, Size: ${(
        metadata.size /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    // Generate DZI tiles
    console.log("🔄 Generating tiles...");
    const startTime = Date.now();

    // Sharp's tile() method automatically creates DZI format
    await sharp(inputPath, {
      limitInputPixels: false,
      sequentialRead: true,
    })
      .tile({
        size: 512, // 512x512 tile size
        overlap: 1, // 1 pixel overlap between tiles
        layout: "dz", // Deep Zoom layout
        format: "webp", // WebP format for best compression
        quality: 85, // High quality WebP
      })
      .toFile(path.join(outputDir, outputName));

    // The above creates both the .dzi file and _files folder automatically
    console.log("📦 Tiles and DZI manifest generated successfully!");

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Calculate max zoom levels
    const maxLevel = Math.ceil(
      Math.log2(Math.max(metadata.width, metadata.height))
    );

    console.log("✅ Tile generation complete!");
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log(`📁 Output: public/tiles/${outputName}.dzi`);
    console.log(`🔍 Max zoom levels: ${maxLevel}`);

    // Count generated tiles
    const tilesDir = path.join(outputDir, `${outputName}_files`);
    if (fs.existsSync(tilesDir)) {
      let totalTiles = 0;
      const levels = fs.readdirSync(tilesDir);
      levels.forEach((level) => {
        const levelDir = path.join(tilesDir, level);
        if (fs.statSync(levelDir).isDirectory()) {
          const tiles = fs.readdirSync(levelDir);
          totalTiles += tiles.length;
        }
      });
      console.log(`🎯 Total tiles generated: ${totalTiles}`);
    }
  } catch (error) {
    console.error("❌ Error generating tiles:", error.message);
    process.exit(1);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      "Usage: node scripts/generate-tiles.js <input-image-path> [output-name]"
    );
    console.log(
      "Example: node scripts/generate-tiles.js ./source-images/hubble-deep-field.tiff hubble"
    );
    process.exit(1);
  }

  const inputPath = args[0];
  const outputName = args[1] || path.parse(inputPath).name;

  generateTiles(inputPath, outputName);
}

module.exports = { generateTiles };
