#!/usr/bin/env python3
"""
Convert TTF fonts to WOFF2 format.
Requires: pip install fonttools[woff]
"""

import os
import sys
from fontTools.ttLib import TTFont

TMP_DIR = "/tmp/cp-fonts"
OUTPUT_DIR = "public/fonts"

# Font files to convert
FONTS = [
    "DMSans-Regular.ttf",
    "DMSans-Medium.ttf",
    "Baloo2-Regular.ttf",
    "Baloo2-SemiBold.ttf",
    "Baloo2-Bold.ttf",
]

def convert_ttf_to_woff2(input_path, output_path):
    """Convert TTF file to WOFF2 format."""
    try:
        font = TTFont(input_path)
        font.flavor = 'woff2'
        font.save(output_path)
        return True
    except Exception as e:
        print(f"Error converting {input_path}: {e}")
        return False

def main():
    if not os.path.exists(TMP_DIR):
        print(f"Error: {TMP_DIR} does not exist. Please run setup-fonts.sh first.")
        sys.exit(1)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("Converting TTF to WOFF2...")
    print("")
    
    success_count = 0
    for font_file in FONTS:
        input_path = os.path.join(TMP_DIR, font_file)
        output_file = font_file.replace(".ttf", ".woff2")
        output_path = os.path.join(OUTPUT_DIR, output_file)
        
        if not os.path.exists(input_path):
            print(f"  ✗ {font_file} not found")
            continue
        
        if convert_ttf_to_woff2(input_path, output_path):
            size = os.path.getsize(output_path) / 1024
            print(f"  ✓ {output_file} ({size:.1f} KB)")
            success_count += 1
        else:
            print(f"  ✗ Failed to convert {font_file}")
    
    print("")
    if success_count == len(FONTS):
        print("✓ All fonts converted successfully!")
    else:
        print(f"⚠️  Converted {success_count}/{len(FONTS)} fonts")
        print("   Install fonttools: pip install fonttools[woff]")

if __name__ == "__main__":
    main()
