# ========================================
# Upload Cosmic Canvas Tiles to R2
# PowerShell Script
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Cosmic Canvas - Upload to R2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$TILES_DIR = "E:\NASA_TILES"
$BUCKET_NAME = "cosmic-canvas-tiles"

# Check if wrangler is installed
try {
    $null = Get-Command wrangler -ErrorAction Stop
    Write-Host "✓ Wrangler CLI found!" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Wrangler CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install it first:" -ForegroundColor Yellow
    Write-Host "  npm install -g wrangler" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if tiles directory exists
if (-not (Test-Path $TILES_DIR)) {
    Write-Host "✗ ERROR: Tiles directory not found: $TILES_DIR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update `$TILES_DIR in this script to point to your tiles folder." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Tiles directory found: $TILES_DIR" -ForegroundColor Green
Write-Host "✓ Bucket name: $BUCKET_NAME" -ForegroundColor Green
Write-Host ""

# Navigate to tiles directory
Set-Location $TILES_DIR

# Upload metadata file
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Uploading metadata file" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$metadataFile = "images-metadata.json"
if (Test-Path $metadataFile) {
    Write-Host "Uploading $metadataFile..." -ForegroundColor Yellow
    try {
        wrangler r2 object put "$BUCKET_NAME/$metadataFile" --file=$metadataFile
        Write-Host "[OK] Metadata uploaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to upload metadata" -ForegroundColor Red
    }
} else {
    Write-Host "[WARNING] $metadataFile not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""

# Upload image folders
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Uploading image folders" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get all subdirectories
$folders = Get-ChildItem -Directory
$totalFolders = $folders.Count
$currentFolder = 0

Write-Host "Found $totalFolders image folders" -ForegroundColor Green
Write-Host ""

foreach ($folder in $folders) {
    $currentFolder++
    $folderName = $folder.Name
    
    Write-Host "[$currentFolder/$totalFolders] Uploading $folderName..." -ForegroundColor Yellow
    
    try {
        Set-Location $folder.FullName
        wrangler r2 object put "$BUCKET_NAME/$folderName" --file=. --recursive
        Write-Host "[OK] $folderName uploaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to upload $folderName" -ForegroundColor Red
    }
    
    Set-Location $TILES_DIR
    Write-Host ""
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Cloudflare Dashboard" -ForegroundColor White
Write-Host "2. Navigate to R2 > $BUCKET_NAME" -ForegroundColor White
Write-Host "3. Go to Settings > Enable Public Access" -ForegroundColor White
Write-Host "4. Copy the public URL" -ForegroundColor White
Write-Host "5. Add it to .env.local as NEXT_PUBLIC_TILES_BASE_URL" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
