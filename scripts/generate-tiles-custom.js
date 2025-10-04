const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Generate Deep Zoom Image (DZI) tiles from a large source image
 * Supports custom output directory
 * Usage: node scripts/generate-tiles-custom.js <input-image-path> <output-dir> [output-name]
 */

async function generateTiles(inputPath, outputDir, outputName = null) {
  try {
    console.log("🚀 Starting tile generation...");
    console.log(`📁 Input: ${inputPath}`);
    console.log(`📂 Output directory: ${outputDir}`);

    // Ensure input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Get output name from filename if not provided
    if (!outputName) {
      outputName = path.parse(inputPath).name;
    }

    console.log(`📝 Output name: ${outputName}`);

    // Create output directory for this specific image
    const imageOutputDir = path.join(outputDir, outputName);
    if (!fs.existsSync(imageOutputDir)) {
      fs.mkdirSync(imageOutputDir, { recursive: true });
      console.log(`✅ Created output directory: ${imageOutputDir}`);
    }

    // Configure Sharp for large images
    sharp.cache(false);
    sharp.concurrency(1);

    // Get image metadata
    console.log("📊 Reading image metadata...");
    const metadata = await sharp(inputPath, {
      limitInputPixels: false,
      sequentialRead: true,
    }).metadata();

    console.log(`   Size: ${metadata.width}x${metadata.height} pixels`);
    console.log(`   Format: ${metadata.format}`);
    console.log(
      `   File size: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(
        2
      )}MB`
    );

    // Generate DZI tiles
    console.log("🔄 Generating tiles (this may take a while)...");
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
        format: "jpeg", // JPEG format for compatibility
        quality: 85, // High quality
      })
      .toFile(path.join(imageOutputDir, outputName));

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
    console.log(`📁 DZI file: ${path.join(imageOutputDir, outputName)}.dzi`);
    console.log(
      `📁 Tiles folder: ${path.join(imageOutputDir, outputName)}_files`
    );
    console.log(`🔍 Max zoom levels: ${maxLevel}`);

    // Count generated tiles
    const tilesDir = path.join(imageOutputDir, `${outputName}_files`);
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

    // Generate thumbnail
    console.log("🖼️  Generating thumbnail...");
    const thumbnailPath = path.join(imageOutputDir, `${outputName}_thumb.jpg`);
    await sharp(inputPath, {
      limitInputPixels: false,
      sequentialRead: true,
    })
      .resize(400, 300, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    console.log(`✅ Thumbnail saved: ${thumbnailPath}`);

    return {
      success: true,
      outputName,
      dziPath: path.join(imageOutputDir, `${outputName}.dzi`),
      tilesPath: path.join(imageOutputDir, `${outputName}_files`),
      thumbnailPath,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        levels: maxLevel,
      },
      duration,
    };
  } catch (error) {
    console.error("❌ Error generating tiles:", error.message);
    console.error(error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(
      "Usage: node scripts/generate-tiles-custom.js <input-image-path> <output-dir> [output-name]"
    );
    console.log(
      "Example: node scripts/generate-tiles-custom.js E:\\NASAimages\\heic2007a.tif E:\\NASA_TILES heic2007a"
    );
    process.exit(1);
  }

  const inputPath = args[0];
  const outputDir = args[1];
  const outputName = args[2] || null;

  generateTiles(inputPath, outputDir, outputName);
}

module.exports = { generateTiles };
