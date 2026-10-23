import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  build: {
    // The client build starts from the entry, not an index.html (the root
    // route renders the document), and writes the manifest prerender reads.
    manifest: true,
    rollupOptions: { input: 'src/entry-client.tsx' },
  },
  ssr: {
    // Workspace packages ship TypeScript source and CSS imports, so the
    // server and prerender builds bundle them instead of asking Node to.
    noExternal: ['@jsonresume/ui', /^@repo\//],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
