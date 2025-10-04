#!/bin/bash
# Upload tiles to Cloudflare R2 using rclone (recommended for large files)
#
# Prerequisites:
# 1. Install rclone: https://rclone.org/downloads/
# 2. Configure rclone for Cloudflare R2:
#    rclone config
#    - Choose "Cloudflare R2"
#    - Name it "r2"
#    - Enter your credentials
#
# Usage:
# bash scripts/upload-to-r2-rclone.sh

TILES_DIR="E:/NASA_TILES"
BUCKET_NAME="cosmic-canvas-tiles"

echo "🚀 Starting upload to Cloudflare R2 using rclone..."
echo ""

# Check if rclone is installed
if ! command -v rclone &> /dev/null; then
    echo "❌ Error: rclone not installed"
    echo "Install from: https://rclone.org/downloads/"
    exit 1
fi

# Check if tiles directory exists
if [ ! -d "$TILES_DIR" ]; then
    echo "❌ Error: Tiles directory not found: $TILES_DIR"
    exit 1
fi

# Sync files to R2
echo "📦 Syncing files to R2..."
echo "This may take a while for large files..."
echo ""

rclone sync "$TILES_DIR/" "r2:$BUCKET_NAME/" \
    --progress \
    --transfers 8 \
    --checkers 16 \
    --stats 10s \
    --stats-one-line

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Upload complete!"
    echo ""
    echo "Next steps:"
    echo "1. Enable public access for your bucket in R2 dashboard"
    echo "2. Copy the public URL (e.g., https://pub-xxxxx.r2.dev)"
    echo "3. Add it to .env.local as NEXT_PUBLIC_TILES_BASE_URL"
    echo "4. Deploy your app to Vercel"
else
    echo ""
    echo "❌ Upload failed"
    echo "Check your rclone configuration and try again"
    exit 1
fi
