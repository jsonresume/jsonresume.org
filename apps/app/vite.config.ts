import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  build: {
    // The client build starts from the entry, not an index.html (the root
    // route renders the document), and writes the manifest prerender reads.
    manifest: true,
    rollupOptions: {
      input: 'src/entry-client.tsx',
      // Node loads resume-themes at runtime (see ssr below). Vite never
      // externalizes a linked workspace package itself, so Rollup is told.
      external: ['@repo/resume-themes'],
    },
  },
  ssr: {
    // Workspace packages ship TypeScript source and CSS imports, so the
    // server and prerender builds bundle them instead of asking Node to.
    // Except resume-themes: Node loads it at runtime, so each theme package
    // resolves from its own node_modules and keeps its template files.
    noExternal: ['@jsonresume/ui', /^@repo\/(?!resume-themes)/],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
