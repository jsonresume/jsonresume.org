import { defineConfig } from 'vitest/config';

// The theme renders JSX in its test, so esbuild needs automatic JSX runtime.
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
