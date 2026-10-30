import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

// Node by default (the index runs on PGlite); page tests opt into jsdom.
// PGlite is slow to start when the whole repo's tests run at once.
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: { testTimeout: 30_000, hookTimeout: 30_000 },
});
