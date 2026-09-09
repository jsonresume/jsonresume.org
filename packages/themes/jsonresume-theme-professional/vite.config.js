import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    target: 'node18',
    outDir: './dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: './src/index.jsx',
      formats: ['es', 'cjs'],
      // Without package type=module, Vite emits index.mjs for ESM and
      // index.js for CommonJS. That preserves legacy require() support.
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
      output: {
        exports: 'named',
      },
    },
  },
  ssr: {
    // Force bundle these packages instead of externalizing
    noExternal: [
      'styled-components',
      '@emotion/is-prop-valid',
      'stylis',
      'shallowequal',
      // marked is ESM-only. Bundle it so the legacy CommonJS entry remains
      // usable by resume-cli and require() consumers.
      'marked',
    ],
  },
});
