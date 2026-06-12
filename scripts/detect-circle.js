import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '..', 'public', 'images', 'poster-bg.png');
console.log('Looking for image at:', imagePath);

async function detectWhiteCircle() {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image: ${width}x${height}, channels: ${channels}`);

  // Find all white pixels (R>240, G>240, B>240)
  const whitePixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (r > 240 && g > 240 && b > 240) {
        whitePixels.push({ x, y });
      }
    }
  }

  console.log(`White pixels found: ${whitePixels.length}`);

  if (whitePixels.length === 0) {
    console.log('No white pixels found!');
    return;
  }

  // Find bounding box of white pixels
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of whitePixels) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  console.log(`Bounding box: x[${minX}, ${maxX}], y[${minY}, ${maxY}]`);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const radiusX = (maxX - minX) / 2;
  const radiusY = (maxY - minY) / 2;
  const radius = (radiusX + radiusY) / 2;

  console.log(`Center: (${centerX}, ${centerY})`);
  console.log(`Radius X: ${radiusX}, Radius Y: ${radiusY}, Avg Radius: ${radius}`);

  // As fractions of image size
  console.log(`\nAs fractions of ${width}:`);
  console.log(`  centerX / width = ${(centerX / width).toFixed(6)}`);
  console.log(`  centerY / height = ${(centerY / height).toFixed(6)}`);
  console.log(`  radius / width = ${(radius / width).toFixed(6)}`);
}

detectWhiteCircle().catch(console.error);
