#!/bin/bash

set -e

FONTS_DIR="public/fonts"
TMP_DIR="/tmp/cp-fonts"

echo "Setting up fonts..."
echo ""

# Create directories
mkdir -p "$FONTS_DIR"
mkdir -p "$TMP_DIR"

# Download TTF files from Google Fonts GitHub
echo "Downloading TTF files..."

# DM Sans
echo "  - DM Sans Regular..."
curl -L -s "https://github.com/google/fonts/raw/main/ofl/dmsans/static/DMSans-Regular.ttf" -o "$TMP_DIR/DMSans-Regular.ttf"
echo "  - DM Sans Medium..."
curl -L -s "https://github.com/google/fonts/raw/main/ofl/dmsans/static/DMSans-Medium.ttf" -o "$TMP_DIR/DMSans-Medium.ttf"

# Baloo 2
echo "  - Baloo 2 Regular..."
curl -L -s "https://github.com/google/fonts/raw/main/ofl/baloo2/static/Baloo2-Regular.ttf" -o "$TMP_DIR/Baloo2-Regular.ttf"
echo "  - Baloo 2 SemiBold..."
curl -L -s "https://github.com/google/fonts/raw/main/ofl/baloo2/static/Baloo2-SemiBold.ttf" -o "$TMP_DIR/Baloo2-SemiBold.ttf"
echo "  - Baloo 2 Bold..."
curl -L -s "https://github.com/google/fonts/raw/main/ofl/baloo2/static/Baloo2-Bold.ttf" -o "$TMP_DIR/Baloo2-Bold.ttf"

echo ""
echo "Converting TTF to WOFF2..."

# Check if woff2_compress is available
if command -v woff2_compress &> /dev/null; then
  # Use woff2_compress if available
  woff2_compress "$TMP_DIR/DMSans-Regular.ttf" && mv "$TMP_DIR/DMSans-Regular.woff2" "$FONTS_DIR/" && echo "  ✓ DMSans-Regular.woff2"
  woff2_compress "$TMP_DIR/DMSans-Medium.ttf" && mv "$TMP_DIR/DMSans-Medium.woff2" "$FONTS_DIR/" && echo "  ✓ DMSans-Medium.woff2"
  woff2_compress "$TMP_DIR/Baloo2-Regular.ttf" && mv "$TMP_DIR/Baloo2-Regular.woff2" "$FONTS_DIR/" && echo "  ✓ Baloo2-Regular.woff2"
  woff2_compress "$TMP_DIR/Baloo2-SemiBold.ttf" && mv "$TMP_DIR/Baloo2-SemiBold.woff2" "$FONTS_DIR/" && echo "  ✓ Baloo2-SemiBold.woff2"
  woff2_compress "$TMP_DIR/Baloo2-Bold.ttf" && mv "$TMP_DIR/Baloo2-Bold.woff2" "$FONTS_DIR/" && echo "  ✓ Baloo2-Bold.woff2"
elif command -v npx &> /dev/null; then
  # Use ttf2woff2 via npx
  echo "  Using ttf2woff2 (via npx)..."
  npx -y ttf2woff2 "$TMP_DIR/DMSans-Regular.ttf" "$FONTS_DIR/DMSans-Regular.woff2" && echo "  ✓ DMSans-Regular.woff2"
  npx -y ttf2woff2 "$TMP_DIR/DMSans-Medium.ttf" "$FONTS_DIR/DMSans-Medium.woff2" && echo "  ✓ DMSans-Medium.woff2"
  npx -y ttf2woff2 "$TMP_DIR/Baloo2-Regular.ttf" "$FONTS_DIR/Baloo2-Regular.woff2" && echo "  ✓ Baloo2-Regular.woff2"
  npx -y ttf2woff2 "$TMP_DIR/Baloo2-SemiBold.ttf" "$FONTS_DIR/Baloo2-SemiBold.woff2" && echo "  ✓ Baloo2-SemiBold.woff2"
  npx -y ttf2woff2 "$TMP_DIR/Baloo2-Bold.ttf" "$FONTS_DIR/Baloo2-Bold.woff2" && echo "  ✓ Baloo2-Bold.woff2"
else
  echo ""
  echo "⚠️  WOFF2 conversion tools not found."
  echo "   TTF files downloaded to: $TMP_DIR"
  echo "   Please convert manually using:"
  echo "   1. Online: https://cloudconvert.com/ttf-to-woff2"
  echo "   2. Or install: npm install -g ttf2woff2"
  echo "   Then place WOFF2 files in: $FONTS_DIR"
  exit 1
fi

# Cleanup
rm -rf "$TMP_DIR"

echo ""
echo "✓ Font setup complete!"
echo "  Files in: $FONTS_DIR"
ls -lh "$FONTS_DIR"/*.woff2 2>/dev/null || echo "  (No WOFF2 files found - conversion may have failed)"
