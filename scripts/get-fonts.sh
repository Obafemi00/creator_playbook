#!/bin/bash
# Simple script to download WOFF2 fonts directly

set -e

FONTS_DIR="public/fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading fonts as WOFF2..."

# Use Google Fonts API to get WOFF2 URLs, then download
download_font() {
  local font_name=$1
  local weight=$2
  local family=$3
  
  echo "  Downloading $font_name..."
  
  # Get CSS from Google Fonts API
  CSS_URL="https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap"
  
  # Extract WOFF2 URL from CSS
  WOFF2_URL=$(curl -sL "$CSS_URL" | grep -oP 'url\(https://[^)]+\.woff2\)' | head -1 | sed 's/url(//;s/)//')
  
  if [ -z "$WOFF2_URL" ]; then
    echo "    ✗ Failed to get URL for $font_name"
    return 1
  fi
  
  # Download WOFF2 file
  if curl -sL "$WOFF2_URL" -o "$FONTS_DIR/$font_name"; then
    SIZE=$(du -h "$FONTS_DIR/$font_name" | cut -f1)
    echo "    ✓ $font_name ($SIZE)"
    return 0
  else
    echo "    ✗ Failed to download $font_name"
    return 1
  fi
}

# DM Sans
download_font "DMSans-Regular.woff2" "400" "DM+Sans"
download_font "DMSans-Medium.woff2" "500" "DM+Sans"

# Baloo 2
download_font "Baloo2-Regular.woff2" "400" "Baloo+2"
download_font "Baloo2-SemiBold.woff2" "600" "Baloo+2"
download_font "Baloo2-Bold.woff2" "700" "Baloo+2"

echo ""
echo "Verifying downloads..."
if [ -f "$FONTS_DIR/DMSans-Regular.woff2" ] && \
   [ -f "$FONTS_DIR/DMSans-Medium.woff2" ] && \
   [ -f "$FONTS_DIR/Baloo2-Regular.woff2" ] && \
   [ -f "$FONTS_DIR/Baloo2-SemiBold.woff2" ] && \
   [ -f "$FONTS_DIR/Baloo2-Bold.woff2" ]; then
  echo "✓ All fonts downloaded successfully!"
  ls -lh "$FONTS_DIR"/*.woff2
else
  echo "⚠️  Some fonts failed to download"
  echo "   See FONT_DOWNLOAD_INSTRUCTIONS.md for manual download"
fi
