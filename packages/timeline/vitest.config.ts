import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

// Node by default; page tests opt into jsdom.
export default defineConfig({ plugins: [vanillaExtractPlugin()] });
