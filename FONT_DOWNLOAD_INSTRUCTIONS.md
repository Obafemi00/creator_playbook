# Font Download Instructions

Since automated font download can be unreliable, please download the fonts manually and place them in `public/fonts/`.

## Required Font Files

You need these 5 files in `public/fonts/`:

1. `DMSans-Regular.woff2` (weight 400)
2. `DMSans-Medium.woff2` (weight 500)
3. `Baloo2-Regular.woff2` (weight 400)
4. `Baloo2-SemiBold.woff2` (weight 600)
5. `Baloo2-Bold.woff2` (weight 700)

## Method 1: Google Fonts Website (Recommended)

1. **DM Sans:**
   - Visit: https://fonts.google.com/specimen/DM+Sans
   - Click "Download family" button (top right)
   - Extract the ZIP file
   - Navigate to the `static` folder
   - Copy these files to `public/fonts/`:
     - `DMSans-Regular.ttf` → Convert to WOFF2 (or use online converter)
     - `DMSans-Medium.ttf` → Convert to WOFF2

2. **Baloo 2:**
   - Visit: https://fonts.google.com/specimen/Baloo+2
   - Click "Download family" button (top right)
   - Extract the ZIP file
   - Navigate to the `static` folder
   - Copy these files to `public/fonts/`:
     - `Baloo2-Regular.ttf` → Convert to WOFF2
     - `Baloo2-SemiBold.ttf` → Convert to WOFF2
     - `Baloo2-Bold.ttf` → Convert to WOFF2

3. **Convert TTF to WOFF2:**
   - Use an online converter: https://cloudconvert.com/ttf-to-woff2
   - Or use command line: `woff2_compress font.ttf`

## Method 2: Using Google Fonts Helper

1. Visit: https://google-webfonts-helper.herokuapp.com/
2. Search for "DM Sans" and "Baloo 2"
3. Select the weights you need
4. Download the WOFF2 files directly
5. Place them in `public/fonts/`

## Method 3: Direct Download URLs (if available)

You can also try downloading directly using these commands:

```bash
# Create fonts directory
mkdir -p public/fonts

# Download DM Sans
curl -L "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans-Regular.ttf" -o /tmp/DMSans-Regular.ttf
curl -L "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans-Medium.ttf" -o /tmp/DMSans-Medium.ttf

# Download Baloo 2
curl -L "https://github.com/google/fonts/raw/main/ofl/baloo2/Baloo2-Regular.ttf" -o /tmp/Baloo2-Regular.ttf
curl -L "https://github.com/google/fonts/raw/main/ofl/baloo2/Baloo2-SemiBold.ttf" -o /tmp/Baloo2-SemiBold.ttf
curl -L "https://github.com/google/fonts/raw/main/ofl/baloo2/Baloo2-Bold.ttf" -o /tmp/Baloo2-Bold.ttf

# Convert to WOFF2 (requires woff2 tools)
# Install: npm install -g ttf2woff2
# Then convert each file
```

## Verification

After placing the files, verify they exist:

```bash
ls -lh public/fonts/
```

You should see all 5 `.woff2` files listed.

## Quick Test

Once fonts are in place, run:

```bash
npm run build
```

The build should complete without any Google Fonts network requests.
