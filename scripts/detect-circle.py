from PIL import Image
import numpy as np

import os
import subprocess

# Find the file
result = subprocess.run(['find', '/', '-name', 'poster-bg.png', '-type', 'f'], capture_output=True, text=True, timeout=10)
print(f"Find results: {result.stdout.strip()}")

found_paths = [p for p in result.stdout.strip().split('\n') if p]
img_path = found_paths[0] if found_paths else None

if not img_path:
    print("Image not found!")
    exit(1)

print(f"Loading: {img_path}")
img = Image.open(img_path).convert("RGBA")
data = np.array(img)
height, width = data.shape[:2]
print(f"Image: {width}x{height}")

# Find white pixels (R>240, G>240, B>240)
if data.shape[2] == 4:  # RGBA
    white_mask = (data[:,:,0] > 240) & (data[:,:,1] > 240) & (data[:,:,2] > 240)
else:  # RGB
    white_mask = (data[:,:,0] > 240) & (data[:,:,1] > 240) & (data[:,:,2] > 240)

white_ys, white_xs = np.where(white_mask)
print(f"White pixels: {len(white_xs)}")

if len(white_xs) == 0:
    print("No white pixels found")
    exit(1)

min_x, max_x = int(white_xs.min()), int(white_xs.max())
min_y, max_y = int(white_ys.min()), int(white_ys.max())

print(f"Bounding box: x[{min_x}, {max_x}], y[{min_y}, {max_y}]")

center_x = (min_x + max_x) / 2
center_y = (min_y + max_y) / 2
radius_x = (max_x - min_x) / 2
radius_y = (max_y - min_y) / 2
radius = (radius_x + radius_y) / 2

print(f"Center: ({center_x}, {center_y})")
print(f"Radius X: {radius_x}, Radius Y: {radius_y}, Avg Radius: {radius}")

print(f"\nAs fractions of {width}:")
print(f"  centerX / width = {center_x / width:.6f}")
print(f"  centerY / height = {center_y / height:.6f}")
print(f"  radius / width = {radius / width:.6f}")
