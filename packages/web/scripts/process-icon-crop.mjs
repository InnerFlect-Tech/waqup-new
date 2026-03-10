#!/usr/bin/env node
/**
 * Processes ChatGPT-generated icon images: crop border, trim dark frame, add transparency, sharpen.
 * Uses Sharp best practices: trim for border removal, sharpen for crispness, lanczos3 for resize.
 *
 * Run: npm run icons:crop --workspace=packages/web
 * TRANSPARENCY_ONLY=1 — skip crop/trim, only re-apply transparency pass
 */

import sharp from 'sharp';
import { readdir, rename } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '../public/images');
const CROP_PERCENT = 0.12; // Crop 12% from each side (removes outer frame)
/** Dark purple BG color for trim() — ChatGPT icon background */
const TRIM_BACKGROUND = '#1a0a2e';
const TRIM_THRESHOLD = 55; // Allow similar dark pixels to be trimmed
/** Luminance below this → transparent (removes any remaining dark halo) */
const TRANSPARENCY_THRESHOLD = 90;
/** Set TRANSPARENCY_ONLY=1 to skip crop/trim (icons already processed) */
const TRANSPARENCY_ONLY = process.env.TRANSPARENCY_ONLY === '1';
const TARGET_SIZE = 512; // Output dimensions (square)

const ICON_FILES = [
  'icon-affirmations.png',
  'icon-meditations.png',
  'icon-rituals.png',
  'icon-voice.png',
  'icon-listen.png',
  'icon-q-coin.png',
];

async function processIcon(file) {
  const inputPath = path.join(IMAGES_DIR, file);
  const meta = await sharp(inputPath).metadata();
  const { width, height } = meta;

  if (!width || !height) {
    console.warn(`Skipping ${file}: could not read dimensions`);
    return;
  }

  let pipeline = sharp(inputPath).ensureAlpha();

  if (!TRANSPARENCY_ONLY) {
    // 1. Crop outer frame
    const cropX = Math.floor(width * CROP_PERCENT);
    const cropY = Math.floor(height * CROP_PERCENT);
    const cropW = width - 2 * cropX;
    const cropH = height - 2 * cropY;
    pipeline = pipeline.extract({ left: cropX, top: cropY, width: cropW, height: cropH });

    // 2. Trim dark border (removes inner frame)
    pipeline = pipeline.trim({
      background: TRIM_BACKGROUND,
      threshold: TRIM_THRESHOLD,
    });
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  // 3. Dark pixels → transparent
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (luminance < TRANSPARENCY_THRESHOLD) data[i + 3] = 0;
  }

  let outPipeline = sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  if (!TRANSPARENCY_ONLY) {
    // 4. Center in square with transparent padding
    const maxDim = Math.max(info.width, info.height);
    const padTop = Math.floor((maxDim - info.height) / 2);
    const padBottom = maxDim - info.height - padTop;
    const padLeft = Math.floor((maxDim - info.width) / 2);
    const padRight = maxDim - info.width - padLeft;

    outPipeline = outPipeline.extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });

    // 5. Resize to target with high-quality kernel
    outPipeline = outPipeline.resize(TARGET_SIZE, TARGET_SIZE, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill',
    });

    // 6. Sharpen for crisp display
    outPipeline = outPipeline.sharpen({ sigma: 1.2 });
  }

  const tmpPath = inputPath + '.tmp';
  await outPipeline
    .png({ compressionLevel: 0 }) // No compression for best quality
    .toFile(tmpPath);

  await rename(tmpPath, inputPath);
  const msg = TRANSPARENCY_ONLY ? 'transparency' : 'crop, trim, sharpen';
  console.log(`Processed ${file}: ${msg}`);
}

async function main() {
  const files = await readdir(IMAGES_DIR);
  for (const file of ICON_FILES) {
    if (files.includes(file)) {
      await processIcon(file);
    } else {
      console.warn(`Skipping ${file}: not found`);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
