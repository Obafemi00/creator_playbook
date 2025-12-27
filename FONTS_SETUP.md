# Font Setup Guide - Self-Hosted Fonts

## ✅ Code Changes Complete

All code has been updated to use self-hosted fonts via `next/font/local`. The build will work with system font fallbacks if font files are missing.

## 📁 Required Font Files

Place these 5 files in `public/fonts/`:

1. `DMSans-Regular.woff2` (weight 400)
2. `DMSans-Medium.woff2` (weight 500)
3. `Baloo2-Regular.woff2` (weight 400)
4. `Baloo2-SemiBold.woff2` (weight 600)
5. `Baloo2-Bold.woff2` (weight 700)

## 🚀 Quick Setup (Choose One Method)

### Method 1: Manual Download (Most Reliable)

1. **Download DM Sans:**
   - Visit: https://fonts.google.com/specimen/DM+Sans
   - Click "Download family" (top right)
   - Extract ZIP → Navigate to `static` folder
   - Find: `DMSans-Regular.ttf` and `DMSans-Medium.ttf`

2. **Download Baloo 2:**
   - Visit: https://fonts.google.com/specimen/Baloo+2
   - Click "Download family" (top right)
   - Extract ZIP → Navigate to `static` folder
   - Find: `Baloo2-Regular.ttf`, `Baloo2-SemiBold.ttf`, `Baloo2-Bold.ttf`

3. **Convert TTF to WOFF2:**
   - Use online converter: https://cloudconvert.com/ttf-to-woff2
   - Upload each TTF file → Download WOFF2
   - Place all 5 WOFF2 files in `public/fonts/`

### Method 2: Using Google Fonts Helper

1. Visit: https://google-webfonts-helper.herokuapp.com/
2. Search for "DM Sans" → Select weights 400, 500 → Download WOFF2
3. Search for "Baloo 2" → Select weights 400, 600, 700 → Download WOFF2
4. Place all files in `public/fonts/`

### Method 3: Automated Script (If Network Works)

```bash
# Try the automated script
chmod +x scripts/get-fonts.sh
./scripts/get-fonts.sh
```

## ✅ Verification

After adding fonts, verify they exist:

```bash
ls -lh public/fonts/*.woff2
```

You should see all 5 files listed.

## 🧪 Test Build

Run the build to verify everything works:

```bash
npm run build
```

**Expected behavior:**
- ✅ Build succeeds (even without fonts, uses system fallbacks)
- ✅ No Google Fonts network requests
- ✅ No ETIMEDOUT errors
- ⚠️  If fonts are missing, you'll see warnings but build still succeeds

## 📝 Files Changed

### Modified:
- `app/layout.tsx` - Switched from `next/font/google` to `next/font/local`
- `tailwind.config.ts` - Updated font variable from `--font-baloo` to `--font-baloo2`

### Created:
- `public/fonts/` - Directory for font files (create if needed)
- `scripts/get-fonts.sh` - Automated download script
- `scripts/setup-fonts.sh` - Alternative setup script
- `scripts/convert-fonts.py` - TTF to WOFF2 converter
- `FONT_DOWNLOAD_INSTRUCTIONS.md` - Detailed instructions
- `FONTS_SETUP.md` - This file

## 🎯 Final Checklist

- [ ] Font files downloaded and placed in `public/fonts/`
- [ ] All 5 WOFF2 files present
- [ ] Run `npm run build` - should succeed
- [ ] Check build logs - no Google Fonts requests
- [ ] Test app - fonts should load correctly
- [ ] Commit font files to git (recommended for production)

## 💡 Notes

- **Build works without fonts:** Next.js will use system font fallbacks
- **Production:** Commit font files to git for reliable builds
- **File size:** WOFF2 files are optimized (~20-40KB each)
- **Fallback fonts:** Sans-serif for DM Sans, system fonts for Baloo 2

## 🐛 Troubleshooting

**Build fails with font errors:**
- Check file paths in `app/layout.tsx` (should be `../public/fonts/...`)
- Verify files exist: `ls public/fonts/*.woff2`
- Check file permissions

**Fonts not loading:**
- Verify files are in correct location
- Check browser console for 404 errors
- Ensure file names match exactly (case-sensitive)

**Network timeout during build:**
- This should NOT happen anymore (fonts are local)
- If it does, check for any remaining `next/font/google` imports
