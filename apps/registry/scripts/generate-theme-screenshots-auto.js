#!/usr/bin/env node

/**
 * Automated Theme Screenshot Generator
 *
 * This script automatically generates hero screenshots for all themes using Playwright.
 * It navigates to each theme URL and captures a viewport screenshot.
 *
 * Prerequisites:
 *   - Dev server must be running: cd apps/registry && pnpm dev
 *   - Playwright must be installed: pnpm add -D playwright
 *
 * Usage:
 *   node apps/registry/scripts/generate-theme-screenshots-auto.js [options]
 *
 * Options:
 *   --force         Regenerate all screenshots, even if they exist
 *   --theme=NAME    Generate screenshot for a specific theme only
 *   --port=3000     Dev server port (default: 3000)
 *   --username=USER Test username to use (default: thomasdavis)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  theme: args.find((arg) => arg.startsWith('--theme='))?.split('=')[1] || null,
  port: parseInt(
    args.find((arg) => arg.startsWith('--port='))?.split('=')[1] || '3000'
  ),
  username:
    args.find((arg) => arg.startsWith('--username='))?.split('=')[1] ||
    'thomasdavis',
};

// Paths
const REPO_ROOT = path.resolve(__dirname, '../../..');
const THEME_METADATA_PATH = path.join(
  REPO_ROOT,
  'packages/theme-config/src/metadata.js'
);
const SCREENSHOTS_DIR = path.join(
  REPO_ROOT,
  'apps/homepage2/public/img/themes'
);
const TEMP_DIR = path.join(REPO_ROOT, '.playwright-mcp');

// Load theme metadata
async function loadThemeMetadata() {
  const content = fs.readFileSync(THEME_METADATA_PATH, 'utf-8');
  const metadataMatch = content.match(
    /export const THEME_METADATA = \{([\s\S]*?)\n\};/
  );

  if (!metadataMatch) {
    throw new Error('Could not parse THEME_METADATA from metadata.js');
  }

  const themeNames = [];
  const keyRegex = /['"]([^'"]+)['"]\s*:/g;
  let match;

  while ((match = keyRegex.exec(metadataMatch[1])) !== null) {
    themeNames.push(match[1]);
  }

  return themeNames;
}

// Check if dev server is running
async function checkDevServer(port) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      resolve(
        res.statusCode === 200 ||
          res.statusCode === 302 ||
          res.statusCode === 404
      );
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Check if screenshot exists
function screenshotExists(themeName) {
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${themeName}.png`);
  return fs.existsSync(screenshotPath);
}

// Get list of themes that need screenshots
async function getThemesNeedingScreenshots() {
  const allThemes = await loadThemeMetadata();

  if (options.theme) {
    if (!allThemes.includes(options.theme)) {
      console.error(`❌ Theme '${options.theme}' not found in theme config`);
      process.exit(1);
    }
    return [options.theme];
  }

  if (options.force) {
    return allThemes;
  }

  return allThemes.filter((theme) => !screenshotExists(theme));
}

// Generate screenshot using Playwright
async function generateScreenshot(page, themeName) {
  const url = `http://localhost:${options.port}/${options.username}?theme=${themeName}`;
  const tempPath = path.join(TEMP_DIR, `${themeName}.png`);
  const finalPath = path.join(SCREENSHOTS_DIR, `${themeName}.png`);

  console.log(`\n📸 Generating screenshot for '${themeName}'...`);
  console.log(`   URL: ${url}`);

  try {
    // Navigate to the theme page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Take screenshot (viewport only for hero shot)
    await page.screenshot({
      path: tempPath,
      type: 'png',
    });

    // Move to final location
    fs.copyFileSync(tempPath, finalPath);
    fs.unlinkSync(tempPath);

    console.log(`   ✅ Saved: ${finalPath}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🎨 Automated Theme Screenshot Generator\n');
  console.log('Configuration:');
  console.log(`  Dev Server: http://localhost:${options.port}`);
  console.log(`  Test User: ${options.username}`);
  console.log(`  Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`  Force Regenerate: ${options.force}`);
  if (options.theme) {
    console.log(`  Specific Theme: ${options.theme}`);
  }
  console.log();

  // Check if dev server is running
  console.log('🔍 Checking dev server...');
  const serverRunning = await checkDevServer(options.port);

  if (!serverRunning) {
    console.error(`\n❌ Dev server is not running on port ${options.port}`);
    console.error('\nPlease start the dev server first:');
    console.error('  cd apps/registry && pnpm dev\n');
    process.exit(1);
  }

  console.log('✅ Dev server is running\n');

  // Ensure directories exist
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.log(`📁 Creating screenshots directory: ${SCREENSHOTS_DIR}`);
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  // Get themes that need screenshots
  const themesToGenerate = await getThemesNeedingScreenshots();

  if (themesToGenerate.length === 0) {
    console.log('✅ All themes already have screenshots!');
    console.log('\nUse --force to regenerate all screenshots');
    console.log('Use --theme=NAME to generate a specific theme screenshot');
    return;
  }

  console.log(
    `📋 Found ${themesToGenerate.length} theme(s) needing screenshots\n`
  );

  // Initialize Playwright
  let browser, page;
  try {
    const playwright = require('playwright');
    console.log('🌐 Launching browser...\n');
    browser = await playwright.chromium.launch();
    page = await browser.newPage({
      viewport: { width: 1280, height: 1024 },
    });

    // Generate screenshots
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < themesToGenerate.length; i++) {
      const theme = themesToGenerate[i];
      console.log(`[${i + 1}/${themesToGenerate.length}] ${theme}`);

      const success = await generateScreenshot(page, theme);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully generated: ${successCount} screenshot(s)`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} screenshot(s)`);
    }
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n❌ Playwright is not installed');
      console.error('\nPlease install Playwright:');
      console.error('  pnpm add -D playwright');
      console.error('  pnpm exec playwright install chromium\n');
    } else {
      console.error('\n❌ Error:', error.message);
    }
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { main };
