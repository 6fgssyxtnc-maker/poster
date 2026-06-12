import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Try to find the image
const tryPaths = [
  './public/images/poster-bg.png',
  '../public/images/poster-bg.png',
  '/home/user/public/images/poster-bg.png',
  '/app/public/images/poster-bg.png',
];

// Also search
const searchDirs = ['.', '/home', '/app', '/tmp', '/var'];
for (const dir of searchDirs) {
  try {
    const entries = fs.readdirSync(dir, { recursive: true });
    for (const e of entries) {
      if (String(e).includes('poster-bg.png')) {
        const fullPath = path.join(dir, String(e));
        tryPaths.unshift(fullPath);
        console.log(`Found candidate: ${fullPath}`);
      }
    }
  } catch {}
}

let imgPath = null;
for (const p of tryPaths) {
  if (fs.existsSync(p)) {
    imgPath = p;
    break;
  }
}

if (!imgPath) {
  console.log("CWD:", process.cwd());
  console.log("Listing CWD:", fs.readdirSync('.'));
  console.log("Image not found in any tried path");
  process.exit(1);
}

console.log(`Loading: ${imgPath}`);

const { data, info } = await sharp(imgPath)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`Image: ${width}x${height}, channels: ${channels}`);

// Find white pixels (R>240 G>240 B>240)
let minX = width, maxX = 0, minY = height, maxY = 0;
let whiteCount = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (r > 240 && g > 240 && b > 240) {
      whiteCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`White pixels: ${whiteCount}`);
console.log(`Bounding box: x[${minX}, ${maxX}], y[${minY}, ${maxY}]`);

const centerX = (minX + maxX) / 2;
const centerY = (minY + maxY) / 2;
const radiusX = (maxX - minX) / 2;
const radiusY = (maxY - minY) / 2;
const radius = (radiusX + radiusY) / 2;

console.log(`Center: (${centerX}, ${centerY})`);
console.log(`Radius X: ${radiusX}, Radius Y: ${radiusY}, Avg: ${radius}`);
console.log(`\nAs fractions of ${width}:`);
console.log(`  cx = ${(centerX / width).toFixed(6)}`);
console.log(`  cy = ${(centerY / height).toFixed(6)}`);
console.log(`  r  = ${(radius / width).toFixed(6)}`);
