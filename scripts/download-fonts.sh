#!/bin/bash

# Create fonts directory
mkdir -p public/fonts

echo "Downloading fonts from Google Fonts..."
echo ""

# DM Sans - Regular (400)
echo "Downloading DMSans-Regular.woff2..."
curl -L "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&display=swap" -o /tmp/dm-sans.css 2>/dev/null
DM_REGULAR_URL=$(grep -oP 'url\(https://[^)]+\.woff2\)' /tmp/dm-sans.css | head -1 | sed 's/url(//;s/)//')
if [ ! -z "$DM_REGULAR_URL" ]; then
  curl -L "$DM_REGULAR_URL" -o public/fonts/DMSans-Regular.woff2 2>/dev/null && echo "✓ DMSans-Regular.woff2" || echo "✗ Failed"
fi

# DM Sans - Medium (500)
echo "Downloading DMSans-Medium.woff2..."
curl -L "https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap" -o /tmp/dm-sans-medium.css 2>/dev/null
DM_MEDIUM_URL=$(grep -oP 'url\(https://[^)]+\.woff2\)' /tmp/dm-sans-medium.css | head -1 | sed 's/url(//;s/)//')
if [ ! -z "$DM_MEDIUM_URL" ]; then
  curl -L "$DM_MEDIUM_URL" -o public/fonts/DMSans-Medium.woff2 2>/dev/null && echo "✓ DMSans-Medium.woff2" || echo "✗ Failed"
fi

# Baloo 2 - Regular (400)
echo "Downloading Baloo2-Regular.woff2..."
curl -L "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400&display=swap" -o /tmp/baloo2.css 2>/dev/null
BALOO_REGULAR_URL=$(grep -oP 'url\(https://[^)]+\.woff2\)' /tmp/baloo2.css | head -1 | sed 's/url(//;s/)//')
if [ ! -z "$BALOO_REGULAR_URL" ]; then
  curl -L "$BALOO_REGULAR_URL" -o public/fonts/Baloo2-Regular.woff2 2>/dev/null && echo "✓ Baloo2-Regular.woff2" || echo "✗ Failed"
fi

# Baloo 2 - SemiBold (600)
echo "Downloading Baloo2-SemiBold.woff2..."
curl -L "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600&display=swap" -o /tmp/baloo2-semibold.css 2>/dev/null
BALOO_SEMIBOLD_URL=$(grep -oP 'url\(https://[^)]+\.woff2\)' /tmp/baloo2-semibold.css | head -1 | sed 's/url(//;s/)//')
if [ ! -z "$BALOO_SEMIBOLD_URL" ]; then
  curl -L "$BALOO_SEMIBOLD_URL" -o public/fonts/Baloo2-SemiBold.woff2 2>/dev/null && echo "✓ Baloo2-SemiBold.woff2" || echo "✗ Failed"
fi

# Baloo 2 - Bold (700)
echo "Downloading Baloo2-Bold.woff2..."
curl -L "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" -o /tmp/baloo2-bold.css 2>/dev/null
BALOO_BOLD_URL=$(grep -oP 'url\(https://[^)]+\.woff2\)' /tmp/baloo2-bold.css | head -1 | sed 's/url(//;s/)//')
if [ ! -z "$BALOO_BOLD_URL" ]; then
  curl -L "$BALOO_BOLD_URL" -o public/fonts/Baloo2-Bold.woff2 2>/dev/null && echo "✓ Baloo2-Bold.woff2" || echo "✗ Failed"
fi

echo ""
echo "Font download complete!"
echo "Files saved to: public/fonts/"
