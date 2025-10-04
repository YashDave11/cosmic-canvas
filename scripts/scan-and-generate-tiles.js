const fs = require("fs");
const path = require("path");
const { generateTiles } = require("./generate-tiles-custom");

/**
 * Scan a directory for images and generate tiles for each
 * Usage: node scripts/scan-and-generate-tiles.js <source-dir> <output-dir>
 */

const SUPPORTED_FORMATS = [".tif", ".tiff", ".jpg", ".jpeg", ".png", ".webp"];

async function scanAndGenerateTiles(sourceDir, outputDir) {
  try {
    console.log("🔍 Scanning for images...");
    console.log(`📁 Source: ${sourceDir}`);
    console.log(`📂 Output: ${outputDir}`);

    // Ensure source directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }

    // Get all files in source directory
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    });

    console.log(`✅ Found ${imageFiles.length} image(s)`);

    if (imageFiles.length === 0) {
      console.log(
        "⚠️  No images found. Supported formats:",
        SUPPORTED_FORMATS.join(", ")
      );
      return;
    }

    // Process each image
    const results = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(sourceDir, file);
      const outputName = path.parse(file).name;

      console.log(`\n${"=".repeat(60)}`);
      console.log(`Processing ${i + 1}/${imageFiles.length}: ${file}`);
      console.log(`${"=".repeat(60)}`);

      const result = await generateTiles(inputPath, outputDir, outputName);
      results.push({
        file,
        ...result,
      });

      if (result.success) {
        console.log(`✅ Successfully processed: ${file}`);
      } else {
        console.log(`❌ Failed to process: ${file}`);
      }
    }

    // Summary
    console.log(`\n${"=".repeat(60)}`);
    console.log("📊 SUMMARY");
    console.log(`${"=".repeat(60)}`);

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Total: ${results.length}`);

    // Save metadata
    const metadataPath = path.join(outputDir, "images-metadata.json");
    const metadata = results
      .filter((r) => r.success)
      .map((r) => ({
        id: r.outputName,
        name: r.outputName,
        file: r.file,
        dziPath: r.dziPath,
        thumbnailPath: r.thumbnailPath,
        width: r.metadata.width,
        height: r.metadata.height,
        format: r.metadata.format,
        levels: r.metadata.levels,
        generatedAt: new Date().toISOString(),
      }));

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n💾 Metadata saved: ${metadataPath}`);

    return results;
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(
      "Usage: node scripts/scan-and-generate-tiles.js <source-dir> <output-dir>"
    );
    console.log(
      "Example: node scripts/scan-and-generate-tiles.js E:\\NASAimages E:\\NASA_TILES"
    );
    process.exit(1);
  }

  const sourceDir = args[0];
  const outputDir = args[1];

  scanAndGenerateTiles(sourceDir, outputDir);
}

module.exports = { scanAndGenerateTiles };
