# Image Names Update

## Summary

Updated all 9 available images with descriptive Hubble Space Telescope names.

## Image Mapping

### External Images (E:\NASA_TILES\)

1. **heic0206c**

   - Name: "Hubble's newest camera images ghostly star-forming pillar of gas and dust"
   - Size: 4,136 × 3,102 pixels
   - Levels: 13

2. **heic0503a**

   - Name: "Light continues to echo three years after stellar outburst"
   - Size: 3,400 × 3,382 pixels
   - Levels: 12

3. **heic0506b**

   - Name: "The Eagle has risen: stellar spire in the Eagle Nebula"
   - Size: 3,857 × 7,804 pixels
   - Levels: 13

4. **heic0910i**

   - Name: "Galactic wreckage in Stephan's Quintet"
   - Size: 6,064 × 6,760 pixels
   - Levels: 13

5. **heic0910s**

   - Name: "Barred spiral galaxy NGC 6217"
   - Size: 2,631 × 3,289 pixels
   - Levels: 12

6. **heic1502a**

   - Name: "Sharpest ever view of the Andromeda Galaxy"
   - Size: 40,000 × 12,788 pixels (512 MP!)
   - Levels: 16

7. **heic2007a**

   - Name: "Tapestry of Blazing Starbirth"
   - Size: 17,043 × 11,710 pixels
   - Levels: 15

8. **opo0328a**
   - Name: "Hubble mosaic of the majestic Sombrero Galaxy"
   - Size: 11,472 × 6,429 pixels
   - Levels: 14

### Local Images (public/tiles/)

9. **andromeda-galaxy**
   - Name: "Holiday wishes from the Hubble Space Telescope"
   - Size: 42,208 × 9,870 pixels (417 MP!)
   - Levels: 17

## Files Updated

1. **E:\NASA_TILES\images-metadata.json**

   - Updated all 8 external image names

2. **app/api/images/route.ts**
   - Updated the local Andromeda Galaxy image name

## Result

All images now display with descriptive Hubble Space Telescope names in the dashboard, making it easier for users to identify and select images for exploration.

## Testing

To verify the changes:

1. Navigate to `/dashboard`
2. Check that all 9 images display with their new descriptive names
3. Search functionality should work with the new names
4. Clicking any image should open the viewer with the correct name in the header
