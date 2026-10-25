// Converts the subset Syne ExtraBold TTF into the three.js typeface JSON that Text3D extrudes.
// Usage: node scripts/build-typeface.mjs [source.ttf] [out.json]
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(process.argv[2] ?? path.join(root, 'public/fonts/syne-extrabold.ttf'));
const out = path.resolve(
  process.argv[3] ?? path.join(root, 'public/fonts/syne-extrabold.typeface.json'),
);
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,-+/&';

const buffer = await readFile(source);
const font = opentype.parse(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
);
const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
const round = (n) => Math.round(n * scale);

const glyphs = {};
for (const char of CHARS) {
  const glyph = font.charToGlyph(char);
  if (!glyph || glyph.index === 0) continue;
  let o = '';
  for (const c of glyph.path.commands) {
    const type = c.type === 'C' ? 'b' : c.type.toLowerCase();
    o += `${type} `;
    if (c.x !== undefined && c.y !== undefined) o += `${round(c.x)} ${round(c.y)} `;
    if (c.x1 !== undefined) o += `${round(c.x1)} ${round(c.y1)} `;
    if (c.x2 !== undefined) o += `${round(c.x2)} ${round(c.y2)} `;
  }
  const box = glyph.getBoundingBox();
  glyphs[char] = {
    ha: round(glyph.advanceWidth),
    x_min: round(box.x1),
    x_max: round(box.x2),
    o: o.trim(),
  };
}

const bbox = {
  yMin: round(font.tables.head.yMin),
  xMin: round(font.tables.head.xMin),
  yMax: round(font.tables.head.yMax),
  xMax: round(font.tables.head.xMax),
};
const json = {
  glyphs,
  familyName: 'Syne',
  ascender: round(font.ascender),
  descender: round(font.descender),
  underlinePosition: round(font.tables.post.underlinePosition),
  underlineThickness: round(font.tables.post.underlineThickness),
  boundingBox: bbox,
  resolution: 1000,
  original_font_information: {
    full_font_name: 'Syne ExtraBold',
    license: 'SIL Open Font License 1.1',
  },
  cssFontWeight: '800',
  cssFontStyle: 'normal',
};
await writeFile(out, JSON.stringify(json));
console.log(
  `${path.relative(root, out)}  ${Object.keys(glyphs).length} glyphs  ${(JSON.stringify(json).length / 1024).toFixed(0)} KB`,
);
