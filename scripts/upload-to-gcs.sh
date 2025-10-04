#!/bin/bash

# Upload tiles to Google Cloud Storage
# Usage: ./scripts/upload-to-gcs.sh YOUR-BUCKET-NAME

set -e

BUCKET_NAME=$1

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Error: Bucket name required"
  echo "Usage: ./scripts/upload-to-gcs.sh YOUR-BUCKET-NAME"
  exit 1
fi

echo "🚀 Starting upload to gs://$BUCKET_NAME"

# Check if bucket exists
if ! gsutil ls -b gs://$BUCKET_NAME > /dev/null 2>&1; then
  echo "📦 Creating bucket gs://$BUCKET_NAME..."
  gsutil mb -c STANDARD -l us-central1 gs://$BUCKET_NAME
  
  echo "🔓 Making bucket public..."
  gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
fi

# Set CORS
echo "🌐 Setting CORS policy..."
cat > /tmp/cors.json << EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
EOF
gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json

# Upload tiles
echo "📤 Uploading tiles..."
gsutil -m cp -r public/TIFF_tiles/* gs://$BUCKET_NAME/

# Set cache control
echo "⚡ Setting cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**

echo "✅ Upload complete!"
echo ""
echo "Your tiles are now available at:"
echo "https://storage.googleapis.com/$BUCKET_NAME/"
echo ""
echo "Set this environment variable in Cloud Run:"
echo "NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/$BUCKET_NAME"
