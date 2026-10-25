import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

// Node by default (the index runs on PGlite); page tests opt into jsdom.
export default defineConfig({ plugins: [vanillaExtractPlugin()] });
