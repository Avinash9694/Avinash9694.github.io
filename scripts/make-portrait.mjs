// One-off: turns the GitHub avatar into the two WebP sizes the intro uses.
// Usage: node scripts/make-portrait.mjs <path-to-avatar.jpg>
// The source is only 340px square, so this crops to head and shoulders and
// stops at 2x of the 120px display size rather than upscaling.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) throw new Error('Pass the avatar path.');

const crop = { left: 50, top: 12, width: 240, height: 240 };
for (const size of [120, 240]) {
  const out = path.join(root, 'public', `avinash-${size}.webp`);
  await sharp(source).extract(crop).resize(size, size).webp({ quality: 82, effort: 6 }).toFile(out);
  console.log(out);
}
