/**
 * Upload tiles to Cloudflare R2
 *
 * Prerequisites:
 * 1. Install wrangler: npm install -g wrangler
 * 2. Login: wrangler login
 * 3. Create bucket: wrangler r2 bucket create cosmic-canvas-tiles
 *
 * Usage:
 * node scripts/upload-to-r2.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const TILES_DIR = "E:\\NASA_TILES";
const BUCKET_NAME = "cosmic-canvas-tiles";

console.log("🚀 Starting upload to Cloudflare R2...\n");

// Check if tiles directory exists
if (!fs.existsSync(TILES_DIR)) {
  console.error(`❌ Error: Tiles directory not found: ${TILES_DIR}`);
  process.exit(1);
}

// Check if wrangler is installed
try {
  execSync("wrangler --version", { stdio: "ignore" });
} catch (error) {
  console.error("❌ Error: Wrangler CLI not installed");
  console.error("Install it with: npm install -g wrangler");
  process.exit(1);
}

// Upload metadata file
console.log("📄 Uploading metadata file...");
const metadataPath = path.join(TILES_DIR, "images-metadata.json");
if (fs.existsSync(metadataPath)) {
  try {
    execSync(
      `wrangler r2 object put ${BUCKET_NAME}/images-metadata.json --file="${metadataPath}"`,
      { stdio: "inherit" }
    );
    console.log("✅ Metadata uploaded\n");
  } catch (error) {
    console.error("❌ Failed to upload metadata");
  }
} else {
  console.warn("⚠️  Metadata file not found, skipping...\n");
}

// Get list of image directories
const imageDirs = fs.readdirSync(TILES_DIR).filter((item) => {
  const itemPath = path.join(TILES_DIR, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`📁 Found ${imageDirs.length} image directories\n`);

// Upload each image directory
imageDirs.forEach((dir, index) => {
  console.log(`[${index + 1}/${imageDirs.length}] Uploading ${dir}...`);
  const dirPath = path.join(TILES_DIR, dir);

  try {
    // Upload entire directory recursively
    // Note: This may take a while for large directories
    execSync(
      `cd "${dirPath}" && for /r %i in (*) do wrangler r2 object put ${BUCKET_NAME}/${dir}/%~nxi --file="%i"`,
      { stdio: "inherit", shell: "cmd.exe" }
    );
    console.log(`✅ ${dir} uploaded\n`);
  } catch (error) {
    console.error(`❌ Failed to upload ${dir}`);
    console.error("Continuing with next directory...\n");
  }
});

console.log("🎉 Upload complete!");
console.log("\nNext steps:");
console.log("1. Enable public access for your bucket in R2 dashboard");
console.log("2. Copy the public URL (e.g., https://pub-xxxxx.r2.dev)");
console.log("3. Add it to .env.local as NEXT_PUBLIC_TILES_BASE_URL");
console.log("4. Deploy your app to Vercel");
