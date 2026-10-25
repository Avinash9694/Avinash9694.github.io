// Bakes the static page into dist/index.html so crawlers and no-JS visitors get the content.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'dist', 'index.html');

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: 'custom',
  logLevel: 'error',
});
try {
  const { renderStatic } = await server.ssrLoadModule('/src/static/render-static.tsx');
  const html = renderStatic();
  const template = await readFile(indexPath, 'utf8');
  if (!template.includes('<!--app-html-->'))
    throw new Error('dist/index.html has no app-html marker');
  await writeFile(indexPath, template.replace('<!--app-html-->', html));
  console.log(
    `prerendered ${(html.length / 1024).toFixed(0)} KB of static HTML into dist/index.html`,
  );
} finally {
  await server.close();
}
