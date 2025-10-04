# Google Cloud Run Deployment Guide

## Prerequisites

- Google Cloud account (free tier available)
- Google Cloud CLI installed
- Docker installed locally (optional, for testing)

## Architecture

- **App**: Google Cloud Run (serverless containers)
- **Tiles**: Google Cloud Storage (static files)
- **Cost**: Free tier covers most usage!

---

## Part 1: Setup Google Cloud Storage for Tiles

### 1. Install Google Cloud CLI

```bash
# Windows (PowerShell as Admin)
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe

# Or download from: https://cloud.google.com/sdk/docs/install
```

### 2. Login and Setup Project

```bash
# Login to Google Cloud
gcloud auth login

# Create new project (or use existing)
gcloud projects create cosmic-canvas-app --name="Cosmic Canvas"

# Set as active project
gcloud config set project cosmic-canvas-app

# Enable required APIs
gcloud services enable storage.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Create Storage Bucket for Tiles

```bash
# Create bucket (choose unique name)
gsutil mb -c STANDARD -l us-central1 gs://cosmic-canvas-tiles

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://cosmic-canvas-tiles

# Set CORS for OpenSeadragon
echo '[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]' > cors.json

gsutil cors set cors.json gs://cosmic-canvas-tiles
```

### 4. Upload Tiles to GCS

```bash
# From your local machine, upload tiles
gsutil -m cp -r public/TIFF_tiles/* gs://cosmic-canvas-tiles/

# Verify upload
gsutil ls gs://cosmic-canvas-tiles/

# Set cache headers for better performance
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://cosmic-canvas-tiles/**
```

Your tiles are now at:

```
https://storage.googleapis.com/cosmic-canvas-tiles/heic0206c/heic0206c.dzi
https://storage.googleapis.com/cosmic-canvas-tiles/heic0503a/heic0503a.dzi
https://storage.googleapis.com/cosmic-canvas-tiles/heic0506b/heic0506b.dzi
```

---

## Part 2: Deploy App to Cloud Run

### Method A: Deploy from GitHub (Recommended)

#### 1. Connect GitHub Repository

```bash
# Enable Cloud Build GitHub integration
gcloud alpha builds connections create github cosmic-canvas-github \
  --region=us-central1

# Follow the prompts to authorize GitHub access
```

#### 2. Create Cloud Build Trigger

```bash
# Create trigger for automatic deployments
gcloud builds triggers create github \
  --name=cosmic-canvas-deploy \
  --repo-name=cosmic-canvas \
  --repo-owner=YashDave11 \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml \
  --region=us-central1
```

#### 3. Create `cloudbuild.yaml`

This file tells Cloud Build how to build and deploy:

```yaml
steps:
  # Build the container image
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/cosmic-canvas:$COMMIT_SHA", "."]

  # Push the container image to Container Registry
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/cosmic-canvas:$COMMIT_SHA"]

  # Deploy container image to Cloud Run
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    entrypoint: gcloud
    args:
      - "run"
      - "deploy"
      - "cosmic-canvas"
      - "--image"
      - "gcr.io/$PROJECT_ID/cosmic-canvas:$COMMIT_SHA"
      - "--region"
      - "us-central1"
      - "--platform"
      - "managed"
      - "--allow-unauthenticated"
      - "--set-env-vars"
      - "NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles"

images:
  - "gcr.io/$PROJECT_ID/cosmic-canvas:$COMMIT_SHA"

options:
  machineType: "E2_HIGHCPU_8"
  logging: CLOUD_LOGGING_ONLY
```

### Method B: Deploy Manually from Local

#### 1. Build and Push Container

```bash
# Set project ID
export PROJECT_ID=cosmic-canvas-app

# Build container
gcloud builds submit --tag gcr.io/$PROJECT_ID/cosmic-canvas

# This will take 5-10 minutes
```

#### 2. Deploy to Cloud Run

```bash
gcloud run deploy cosmic-canvas \
  --image gcr.io/$PROJECT_ID/cosmic-canvas \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

---

## Part 3: Update Metadata File

Update `public/TIFF_tiles/images-metadata.json` to work with cloud storage:

The app will automatically use the `NEXT_PUBLIC_TILES_BASE_URL` environment variable.

---

## Testing

### Test Locally with Docker

```bash
# Build
docker build -t cosmic-canvas .

# Run with GCS tiles
docker run -p 8080:8080 \
  -e NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/cosmic-canvas-tiles \
  cosmic-canvas

# Open http://localhost:8080
```

### Test Cloud Run Deployment

After deployment, Cloud Run will give you a URL like:

```
https://cosmic-canvas-xxxxx-uc.a.run.app
```

---

## Cost Estimate (Free Tier)

### Cloud Storage

- **Storage**: 5 GB free/month (your tiles: ~2-3 GB) ✅
- **Network**: 1 GB free egress/month
- **Operations**: 5,000 Class A ops free/month

### Cloud Run

- **CPU**: 180,000 vCPU-seconds free/month
- **Memory**: 360,000 GiB-seconds free/month
- **Requests**: 2 million requests free/month
- **Network**: 1 GB egress free/month

**Total**: Should stay in free tier for moderate traffic! 🎉

---

## Monitoring

```bash
# View logs
gcloud run services logs read cosmic-canvas --region us-central1

# View service details
gcloud run services describe cosmic-canvas --region us-central1

# Check storage usage
gsutil du -sh gs://cosmic-canvas-tiles
```

---

## Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service cosmic-canvas \
  --domain your-domain.com \
  --region us-central1
```

---

## Troubleshooting

### Build fails

- Check Dockerfile syntax
- Ensure `output: 'standalone'` in next.config.mjs
- Check Cloud Build logs: `gcloud builds list`

### Tiles not loading

- Verify CORS: `gsutil cors get gs://cosmic-canvas-tiles`
- Check bucket is public: `gsutil iam get gs://cosmic-canvas-tiles`
- Test tile URL directly in browser

### App crashes

- Check logs: `gcloud run services logs read cosmic-canvas`
- Increase memory: `--memory 1Gi`
- Check environment variables are set

---

## Cleanup (if needed)

```bash
# Delete Cloud Run service
gcloud run services delete cosmic-canvas --region us-central1

# Delete storage bucket
gsutil rm -r gs://cosmic-canvas-tiles

# Delete container images
gcloud container images delete gcr.io/$PROJECT_ID/cosmic-canvas
```
