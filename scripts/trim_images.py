from PIL import Image
import os

def trim_transparent_padding(input_path: str, output_path: str, padding: int = 0):
    """
    Crops a PNG to the bounding box of non-transparent pixels.
    Optional padding adds extra pixels around the cropped content.
    """
    img = Image.open(input_path).convert("RGBA")
    alpha = img.split()[-1]  # alpha channel

    bbox = alpha.getbbox()  # bounding box of non-zero alpha
    if not bbox:
        # Image is fully transparent; just save as-is.
        img.save(output_path)
        return

    left, top, right, bottom = bbox

    # Apply padding safely within image bounds
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)

    cropped = img.crop((left, top, right, bottom))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cropped.save(output_path)

def batch_trim(folder_in: str, folder_out: str, padding: int = 0):
    os.makedirs(folder_out, exist_ok=True)
    for filename in os.listdir(folder_in):
        if filename.lower().endswith(".png"):
            inp = os.path.join(folder_in, filename)
            out = os.path.join(folder_out, filename.replace(".png", "_trimmed.png"))
            trim_transparent_padding(inp, out, padding=padding)
            print(f"Trimmed: {filename} -> {os.path.basename(out)}")

# Example usage:
# trim_transparent_padding("Creator_Playbook_Logo_Full_Colorful_NoBG.png", "out/logo_trimmed.png", padding=10)
# batch_trim("logos", "logos_trimmed", padding=10)
