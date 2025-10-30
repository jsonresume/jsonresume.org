#!/usr/bin/env node

/**
 * Generate Screenshots for All Themes
 *
 * This script:
 * 1. Starts the registry dev server
 * 2. Uses Playwright to render each theme with test resume
 * 3. Captures screenshots
 * 4. Saves to public/theme-screenshots/
 * 5. Generates themes.json metadata file
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

// Theme metadata (optional - provides enhanced info for themes)
const THEME_METADATA = {
  reference: {
    title: 'Reference',
    description:
      'Clean and professional reference theme showcasing all JSON Resume features',
    author: 'JSON Resume Team',
    tags: ['professional', 'clean', 'reference'],
  },
  modern: {
    title: 'Modern',
    description:
      'Contemporary design with purple accents and card-based layout',
    author: 'JSON Resume Team',
    tags: ['modern', 'purple', 'cards'],
  },
  sidebar: {
    title: 'Sidebar',
    description:
      'Two-column layout with dark blue sidebar and professional appearance',
    author: 'JSON Resume Team',
    tags: ['professional', 'two-column', 'sidebar'],
  },
  'elegant-pink': {
    title: 'Elegant Pink',
    description:
      'Beautiful feminine theme with soft pink colors and floral accents',
    author: 'JSON Resume Team',
    tags: ['feminine', 'pink', 'elegant', 'pretty'],
  },
  standard: {
    title: 'Standard',
    description: 'Classic JSON Resume standard theme',
    author: 'JSON Resume',
    tags: ['classic', 'standard'],
  },
  professional: {
    title: 'Professional',
    description: 'Clean professional theme with serif typography',
    author: 'JSON Resume',
    tags: ['professional', 'serif', 'classic'],
  },
  spartacus: {
    title: 'Spartacus',
    description: 'Bold theme with strong typography',
    author: 'JSON Resume',
    tags: ['bold', 'modern'],
  },
  cv: {
    title: 'CV',
    description: 'Traditional CV layout',
    author: 'JSON Resume',
    tags: ['traditional', 'cv'],
  },
  flat: {
    title: 'Flat',
    description: 'Flat design with minimalist aesthetic',
    author: 'JSON Resume',
    tags: ['flat', 'minimalist'],
  },
  elegant: {
    title: 'Elegant',
    description: 'Elegant and refined design',
    author: 'JSON Resume',
    tags: ['elegant', 'refined'],
  },
  'desert-modern': {
    title: 'Desert Modern',
    description:
      'Warm minimalist resume with amber accents and cream background',
    author: 'JSON Resume Team',
    tags: ['warm', 'minimal', 'single-column'],
  },
};

// Format theme name for display (e.g., "elegant-pink" -> "Elegant Pink")
function formatThemeName(themeName) {
  return themeName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Full list of themes from themeConfig.js (manually synced)
// TODO: Auto-generate this list from themeConfig.js during build
const ALL_THEMES = [
  'ace',
  'actual',
  'autumn',
  'cora',
  'cv',
  'professional',
  'elegant',
  'full',
  'flat',
  'el-santo',
  'even',
  'github',
  'github2',
  'jacrys',
  'kards',
  'kendall',
  'lucide',
  'macchiato',
  'mantra',
  'mocha-responsive',
  'minyma',
  'msresume',
  'one',
  'onepage',
  'onepage-plus',
  'onepageresume',
  'orbit',
  'paper',
  'papirus',
  'paper-plus-plus',
  'pumpkin',
  'relaxed',
  'rocketspacer',
  'simple-red',
  'rickosborne',
  'spartan',
  'spartacus',
  'standard',
  'stackoverflow',
  'standard-resume',
  'tan-responsive',
  'techlead',
  'reference',
  'modern',
  'sidebar',
  'modern-classic',
  'executive-slate',
  'product-manager-canvas',
  'government-standard',
  'developer-mono',
  'minimalist-grid',
  'creative-studio',
  'data-driven',
  'consultant-polished',
  'university-first',
  'academic-cv-lite',
  'sales-hunter',
  'marketing-narrative',
  'operations-precision',
  'writers-portfolio',
  'desert-modern',
];

// Get list of themes from the registry themeConfig
async function getThemesList() {
  return ALL_THEMES;
}

async function generateScreenshots() {
  console.log('🎨 Theme Screenshot Generator\n');

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

  // Get list of themes
  const themes = await getThemesList();
  console.log(`✓ Found ${themes.length} themes to process\n`);

  const results = [];

  // Generate screenshot for each theme
  for (const themeName of themes) {
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
      const screenshotPath = path.join(OUTPUT_DIR, `${themeName}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`  ✓ Saved to ${themeName}.png`);

      // Collect metadata (use THEME_METADATA if available, otherwise generate defaults)
      const metadata = THEME_METADATA[themeName] || {};
      results.push({
        id: themeName,
        name: metadata.title || formatThemeName(themeName),
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
  console.log(`   Screenshots: ${results.filter((r) => r.screenshot).length}`);
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
