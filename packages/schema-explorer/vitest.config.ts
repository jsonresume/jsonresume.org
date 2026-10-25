import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'] },
});
