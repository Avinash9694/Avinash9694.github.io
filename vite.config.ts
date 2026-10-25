import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  // The footer renders this year first so the prerendered HTML hydrates cleanly, then the visitor's.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('vite/preload-helper') ||
            /\/node_modules\/(react|react-dom|scheduler|zustand)\//.test(id)
          ) {
            return 'react';
          }
          if (
            id.includes('/node_modules/postprocessing/') ||
            id.includes('@react-three/postprocessing')
          ) {
            return 'postfx';
          }
          if (
            id.includes('/node_modules/three/') ||
            id.includes('/node_modules/three-stdlib/') ||
            id.includes('@react-three/') ||
            id.includes('/node_modules/troika') ||
            id.includes('/node_modules/maath/')
          ) {
            return 'three';
          }
          if (id.includes('/node_modules/gsap/') || id.includes('/node_modules/lenis/')) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
