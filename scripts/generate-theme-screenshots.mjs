#!/usr/bin/env node

/**
 * Generate Screenshots for All Themes
 *
 * This script:
 * 1. Imports theme list and metadata from themeConfig.js (single source of truth)
 * 2. Uses Playwright to render each theme with test resume
 * 3. Captures screenshots (skips if file already exists)
 * 4. Saves to public/theme-screenshots/
 * 5. Generates themes.json metadata file
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:3000';
const TEST_USERNAME = 'thomasdavis'; // Using existing test user
const OUTPUT_DIR = path.join(
  __dirname,
  '../apps/homepage2/public/theme-screenshots'
);
const METADATA_FILE = path.join(
  __dirname,
  '../apps/homepage2/public/themes.json'
);

// Format theme name for display (e.g., "elegant-pink" -> "Elegant Pink")
function formatThemeName(themeName) {
  return themeName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Check if dev server is running
async function checkDevServer() {
  try {
    const response = await fetch(REGISTRY_URL, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function generateScreenshots() {
  console.log('🎨 Theme Screenshot Generator\n');

  // Check if dev server is running
  console.log('🔍 Checking if dev server is running...');
  const isServerRunning = await checkDevServer();
  if (isServerRunning) {
    console.error('❌ Error: Dev server is already running at', REGISTRY_URL);
    console.error(
      '   Please stop the dev server before generating screenshots.'
    );
    process.exit(1);
  }
  console.log('✓ No dev server detected\n');

  // Load theme configuration dynamically
  console.log('📦 Loading theme configuration...');
  const themeConfigPath = path.join(
    __dirname,
    '../apps/registry/lib/formatters/template/themeConfig.js'
  );
  const { THEME_NAMES, THEME_METADATA } = await import(
    `file://${themeConfigPath}`
  );
  console.log(`✓ Loaded ${THEME_NAMES.length} themes\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  // Get list of themes from loaded config
  const themes = THEME_NAMES;
  console.log(`📸 Processing ${themes.length} themes...\n`);

  const results = [];
  let skipped = 0;
  let generated = 0;

  // Generate screenshot for each theme
  for (const themeName of themes) {
    const screenshotPath = path.join(OUTPUT_DIR, `${themeName}.png`);

    // Check if screenshot already exists
    if (fs.existsSync(screenshotPath)) {
      console.log(`⏭️  Skipping ${themeName} (screenshot exists)`);
      skipped++;

      // Still add to results with metadata
      const metadata = THEME_METADATA[themeName] || {};
      results.push({
        id: themeName,
        name: metadata.name || formatThemeName(themeName),
        description:
          metadata.description || `${formatThemeName(themeName)} resume theme`,
        author: metadata.author || 'Community',
        tags: metadata.tags || [],
        screenshot: `/theme-screenshots/${themeName}.png`,
        previewUrl: `${REGISTRY_URL}/${TEST_USERNAME}?theme=${themeName}`,
      });
      continue;
    }

    try {
      console.log(`📸 Capturing ${themeName}...`);

      const url = `${REGISTRY_URL}/${TEST_USERNAME}?theme=${themeName}`;
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait a bit for any animations
      await page.waitForTimeout(500);

      // Take screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`  ✓ Saved to ${themeName}.png`);
      generated++;

      // Collect metadata (use THEME_METADATA if available, otherwise generate defaults)
      const metadata = THEME_METADATA[themeName] || {};
      results.push({
        id: themeName,
        name: metadata.name || formatThemeName(themeName),
        description:
          metadata.description || `${formatThemeName(themeName)} resume theme`,
        author: metadata.author || 'Community',
        tags: metadata.tags || [],
        screenshot: `/theme-screenshots/${themeName}.png`,
        previewUrl: `${REGISTRY_URL}/${TEST_USERNAME}?theme=${themeName}`,
      });
    } catch (error) {
      console.error(`  ✗ Error capturing ${themeName}:`, error.message);
      results.push({
        id: themeName,
        name: themeName,
        error: error.message,
        screenshot: null,
      });
    }
  }

  await browser.close();

  // Generate metadata JSON file
  console.log(`\n📝 Generating themes.json metadata...`);
  const metadata = {
    generated: new Date().toISOString(),
    count: results.length,
    themes: results.sort((a, b) => a.name.localeCompare(b.name)),
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
  console.log(`✓ Saved metadata to themes.json`);

  // Summary
  console.log(`\n✨ Complete!`);
  console.log(`   Total: ${results.length}`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${results.filter((r) => r.error).length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateScreenshots().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { generateScreenshots };
