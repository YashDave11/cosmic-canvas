# Deploy to Google Cloud Run + Cloud Storage

Complete guide to deploy your app on Google Cloud Run with tiles on Cloud Storage.

## Prerequisites

1. Google Cloud account (free tier includes $300 credit)
2. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install

## Part 1: Setup Google Cloud Storage for Tiles

### 1. Create GCS Bucket

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Create bucket for tiles (choose unique name)
gsutil mb -c STANDARD -l us-central1 gs://cosmic-canvas-tiles

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://cosmic-canvas-tiles
```

### 2. Configure CORS

Create `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

Apply CORS:

```bash
gsutil cors set cors.json gs://cosmic-canvas-tiles
```

### 3. Upload Tiles

```bash
# Upload all tiles from your local machine
gsutil -m cp -r public/TIFF_tiles/* gs://cosmic-canvas-tiles/

# Set cache control for better performance
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://cosmic-canvas-tiles/**

# Verify upload
gsutil ls gs://cosmic-canvas-tiles/
```

### 4. Copy Metadata File

```bash
# Upload the metadata file
gsutil cp public/TIFF_tiles/images-metadata.json gs://cosmic-canvas-tiles/images-metadata.json
```

## Part 2: Deploy App to Cloud Run

### Option A: Manual Deployment (Quick Start)

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy in one command
gcloud run deploy cosmic-canvas \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles

# This will:
# 1. Build Docker image
# 2. Push to Container Registry
# 3. Deploy to Cloud Run
# 4. Give you a public URL
```

### Option B: Automatic Deployment from GitHub

#### 1. Connect GitHub Repository

```bash
# Connect your GitHub repo to Cloud Build
gcloud builds triggers create github \
  --repo-name=cosmic-canvas \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

#### 2. Update cloudbuild.yaml

Edit `cloudbuild.yaml` and replace `YOUR-BUCKET-NAME` with your actual bucket name:

```yaml
- "NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles"
```

#### 3. Push to GitHub

```bash
git add .
git commit -m "Add Cloud Run deployment config"
git push origin main
```

Now every push to `main` branch will automatically deploy!

## Part 3: Update Metadata API for Cloud Storage

The app needs to read metadata from Cloud Storage instead of local files.

### 1. Download metadata at build time

Update `Dockerfile` to fetch metadata:

```dockerfile
# Add after COPY --from=builder /app/public ./public
RUN mkdir -p ./public/TIFF_tiles
RUN wget -O ./public/TIFF_tiles/images-metadata.json \
  https://storage.googleapis.com/cosmic-canvas-tiles/images-metadata.json || \
  echo '[]' > ./public/TIFF_tiles/images-metadata.json
```

### 2. Or use Cloud Storage API (Better for dynamic updates)

Install Google Cloud Storage client:

```bash
npm install @google-cloud/storage
```

Update `app/api/images/route.ts` to fetch from GCS.

## Cost Estimate (Free Tier)

### Cloud Storage

- Storage: 5 GB free/month (your tiles: ~2-3 GB) ✅
- Network egress: 1 GB free/month
- Operations: 5,000 Class A ops free/month

### Cloud Run

- 2 million requests/month free ✅
- 360,000 GB-seconds memory free/month ✅
- 180,000 vCPU-seconds free/month ✅

**Your app will likely stay in free tier!**

## Testing Locally with Docker

```bash
# Build image
docker build -t cosmic-canvas .

# Run locally
docker run -p 8080:8080 \
  -e NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles \
  cosmic-canvas

# Open http://localhost:8080
```

## Custom Domain (Optional)

```bash
# Map custom domain
gcloud run services update cosmic-canvas \
  --region us-central1 \
  --platform managed \
  --add-custom-domain your-domain.com
```

## Monitoring

View logs:

```bash
gcloud run services logs read cosmic-canvas --region us-central1
```

View metrics in Cloud Console:
https://console.cloud.google.com/run

## Troubleshooting

### Build fails

```bash
# Check build logs
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

### Service not accessible

```bash
# Check service status
gcloud run services describe cosmic-canvas --region us-central1

# Make sure it's public
gcloud run services add-iam-policy-binding cosmic-canvas \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### Tiles not loading

- Check CORS: `gsutil cors get gs://cosmic-canvas-tiles`
- Check bucket is public: `gsutil iam get gs://cosmic-canvas-tiles`
- Verify URLs in browser: `https://storage.googleapis.com/cosmic-canvas-tiles/heic0206c/heic0206c.dzi`

## Cleanup

```bash
# Delete Cloud Run service
gcloud run services delete cosmic-canvas --region us-central1

# Delete bucket
gsutil rm -r gs://cosmic-canvas-tiles

# Delete container images
gcloud container images delete gcr.io/PROJECT_ID/cosmic-canvas
```

## Next Steps

1. ✅ Upload tiles to GCS
2. ✅ Deploy app to Cloud Run
3. 🎨 Add custom domain
4. 📊 Setup monitoring alerts
5. 🚀 Optimize with CDN (optional)
