// One-off: converts the 1440x900 project screenshots in ../_shots to 1200px WebP covers.
// Usage: node scripts/optimize-screenshots.mjs [sourceDir]
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.resolve(process.argv[2] ?? path.join(root, '..', '_shots'));
const outDir = path.join(root, 'public', 'screenshots');

const SOURCES = {
  'iam-policy-analyzer': 'iam-policy-analyzer-desktop.png',
  'cloud-audit-mcp': 'cloud-audit-mcp-desktop.png',
  'sse-stream-inspector': 'sse-stream-inspector-desktop.png',
  'iac-diff-viewer': 'iac-diff-viewer-desktop.png',
  TasteOfIndiaHub: 'TasteOfIndiaHub-desktop.png',
  'Ecommerce-APP': 'Ecommerce-APP-desktop.png',
  'Laundry-cart-frontend': 'Laundry-cart-frontend-dashboard.png',
  '3D-Virtual-Environment': '3D-Virtual-Environment-desktop.png',
};

await mkdir(outDir, { recursive: true });
let total = 0;
for (const [slug, file] of Object.entries(SOURCES)) {
  const out = path.join(outDir, `${slug}.webp`);
  await sharp(path.join(sourceDir, file))
    .resize({ width: 1200, height: 750, fit: 'cover', position: 'top' })
    .webp({ quality: 80, effort: 6 })
    .toFile(out);
  const { size } = await stat(out);
  total += size;
  console.log(`${slug}.webp  ${(size / 1024).toFixed(0)} KB`);
}
console.log(`total ${(total / 1024).toFixed(0)} KB`);
