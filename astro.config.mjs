import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://avinash9694.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react({ include: ['**/components/graph/**'] })],
  build: { inlineStylesheets: 'auto' },
});
