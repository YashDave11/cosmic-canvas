@echo off
REM ========================================
REM Upload Cosmic Canvas Tiles to R2
REM ========================================

echo.
echo ========================================
echo  Cosmic Canvas - Upload to R2
echo ========================================
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Wrangler CLI not found!
    echo.
    echo Please install it first:
    echo   npm install -g wrangler
    echo.
    pause
    exit /b 1
)

echo Wrangler CLI found!
echo.

REM Set the tiles directory
set TILES_DIR=E:\NASA_TILES
set BUCKET_NAME=cosmic-canvas-tiles

REM Check if tiles directory exists
if not exist "%TILES_DIR%" (
    echo ERROR: Tiles directory not found: %TILES_DIR%
    echo.
    echo Please update TILES_DIR in this script to point to your tiles folder.
    echo.
    pause
    exit /b 1
)

echo Tiles directory found: %TILES_DIR%
echo Bucket name: %BUCKET_NAME%
echo.

REM Navigate to tiles directory
cd /d "%TILES_DIR%"

echo ========================================
echo Step 1: Uploading metadata file
echo ========================================
echo.

if exist "images-metadata.json" (
    echo Uploading images-metadata.json...
    wrangler r2 object put %BUCKET_NAME%/images-metadata.json --file=images-metadata.json
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Metadata uploaded successfully!
    ) else (
        echo [ERROR] Failed to upload metadata
    )
) else (
    echo [WARNING] images-metadata.json not found, skipping...
)

echo.
echo ========================================
echo Step 2: Uploading image folders
echo ========================================
echo.

REM Count folders
set count=0
for /d %%i in (*) do set /a count+=1

echo Found %count% image folders
echo.

REM Upload each folder
set current=0
for /d %%i in (*) do (
    set /a current+=1
    echo [!current!/%count%] Uploading %%i...
    cd "%%i"
    wrangler r2 object put %BUCKET_NAME%/%%i --file=. --recursive
    if %ERRORLEVEL% EQU 0 (
        echo [OK] %%i uploaded successfully!
    ) else (
        echo [ERROR] Failed to upload %%i
    )
    cd ..
    echo.
)

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Cloudflare Dashboard
echo 2. Navigate to R2 ^> %BUCKET_NAME%
echo 3. Go to Settings ^> Enable Public Access
echo 4. Copy the public URL
echo 5. Add it to .env.local as NEXT_PUBLIC_TILES_BASE_URL
echo.
pause
