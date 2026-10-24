import { defineConfig } from 'vitest/config';

// These tests boot an in-memory Postgres (PGlite), which is slow to start
// when the whole repo's tests run at once.
export default defineConfig({
  test: { testTimeout: 30_000, hookTimeout: 30_000 },
});
