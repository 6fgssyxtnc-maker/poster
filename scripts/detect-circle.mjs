import sharp from "sharp";

const img = sharp("public/images/poster-bg.png");
const metadata = await img.metadata();
const { width, height } = metadata;
console.log(`Image size: ${width}x${height}`);

// Get raw pixel data
const { data } = await img.raw().toBuffer({ resolveWithObject: true });

// Find the bounding box of the white circle
// White pixels: R>240, G>240, B>240
let minX = width, maxX = 0, minY = height, maxY = 0;
let whitePixels = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 3; // 3 channels (RGB, no alpha for raw)
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (r > 240 && g > 240 && b > 240) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      whitePixels.push({ x, y });
    }
  }
}

console.log(`White region bounding box:`);
console.log(`  X: ${minX} to ${maxX} (width: ${maxX - minX})`);
console.log(`  Y: ${minY} to ${maxY} (height: ${maxY - minY})`);

const centerX = (minX + maxX) / 2;
const centerY = (minY + maxY) / 2;
const radiusX = (maxX - minX) / 2;
const radiusY = (maxY - minY) / 2;
const avgRadius = (radiusX + radiusY) / 2;

console.log(`\nEstimated circle center: (${centerX}, ${centerY})`);
console.log(`Estimated radius X: ${radiusX}, Y: ${radiusY}, avg: ${avgRadius}`);
console.log(`\nAs ratios of ${width}x${height}:`);
console.log(`  centerX ratio: ${(centerX / width).toFixed(6)}`);
console.log(`  centerY ratio: ${(centerY / height).toFixed(6)}`);
console.log(`  radius ratio:  ${(avgRadius / width).toFixed(6)}`);

// Also scan horizontal midline of the circle to verify
const midY = Math.round(centerY);
let leftEdge = null, rightEdge = null;
for (let x = 0; x < width; x++) {
  const idx = (midY * width + x) * 3;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  if (r > 240 && g > 240 && b > 240) {
    if (leftEdge === null) leftEdge = x;
    rightEdge = x;
  }
}
console.log(`\nHorizontal scan at y=${midY}: left=${leftEdge}, right=${rightEdge}`);
console.log(`  Horizontal center: ${(leftEdge + rightEdge) / 2}, radius: ${(rightEdge - leftEdge) / 2}`);

// Vertical scan at center X
const midX = Math.round(centerX);
let topEdge = null, bottomEdge = null;
for (let y = 0; y < height; y++) {
  const idx = (y * width + midX) * 3;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  if (r > 240 && g > 240 && b > 240) {
    if (topEdge === null) topEdge = y;
    bottomEdge = y;
  }
}
console.log(`Vertical scan at x=${midX}: top=${topEdge}, bottom=${bottomEdge}`);
console.log(`  Vertical center: ${(topEdge + bottomEdge) / 2}, radius: ${(bottomEdge - topEdge) / 2}`);
