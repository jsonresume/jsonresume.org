import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'vitest/config';

// Library build: one ES module per source file (so "use client" directives
// survive and apps load only what they import) and one extracted
// stylesheet, dist/styles.css, which apps import once.
export default defineConfig({
  plugins: [
    vanillaExtractPlugin({ identifiers: 'short' }),
    react(),
    preserveDirectives(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: { index: 'src/index.ts', 'tokens/index': 'src/tokens/index.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        /^(react|react-dom|@radix-ui|@vanilla-extract\/recipes\/createRuntimeFn)/.test(
          id
        ),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith('.css'))
            ? 'styles.css'
            : '[name][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
