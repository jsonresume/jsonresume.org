import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  ssr: {
    // Bundle the design system into the prerender build so its CSS imports
    // resolve through Vite rather than Node.
    noExternal: ['@jsonresume/ui'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
