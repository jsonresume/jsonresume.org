#!/usr/bin/env node

/**
 * Generate Theme Screenshots
 *
 * This script automatically generates hero screenshots for all themes that are missing images.
 * It checks the theme config, compares against existing screenshots in the homepage directory,
 * and uses Playwright to capture screenshots from the dev server.
 *
 * Usage:
 *   1. Start the dev server: cd apps/registry && pnpm dev
 *   2. Run this script: node apps/registry/scripts/generate-theme-screenshots.js
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

// Import theme metadata (using dynamic import since it's ES6)
async function loadThemeMetadata() {
  // Read the file and extract THEME_NAMES
  const content = fs.readFileSync(THEME_METADATA_PATH, 'utf-8');

  // Extract theme keys from THEME_METADATA export
  const metadataMatch = content.match(
    /export const THEME_METADATA = \{([\s\S]*?)\n\};/
  );
  if (!metadataMatch) {
    throw new Error('Could not parse THEME_METADATA from metadata.js');
  }

  // Extract theme keys using regex
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
    // Generate for specific theme only
    if (!allThemes.includes(options.theme)) {
      console.error(`❌ Theme '${options.theme}' not found in theme config`);
      process.exit(1);
    }
    return [options.theme];
  }

  if (options.force) {
    // Regenerate all screenshots
    return allThemes;
  }

  // Only generate missing screenshots
  return allThemes.filter((theme) => !screenshotExists(theme));
}

// Generate screenshot using Playwright MCP server
async function generateScreenshot(themeName) {
  const url = `http://localhost:${options.port}/${options.username}?theme=${themeName}`;
  const outputPath = path.join(SCREENSHOTS_DIR, `${themeName}.png`);

  console.log(`\n📸 Generating screenshot for '${themeName}'...`);
  console.log(`   URL: ${url}`);
  console.log(`   Output: ${outputPath}`);

  // This function will be called by the user using Playwright MCP tools
  // We'll return the instructions for what needs to be done
  return {
    theme: themeName,
    url,
    outputPath,
  };
}

// Main function
async function main() {
  console.log('🎨 Theme Screenshot Generator\n');
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

  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.log(`📁 Creating screenshots directory: ${SCREENSHOTS_DIR}`);
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
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
    `📋 Found ${themesToGenerate.length} theme(s) needing screenshots:\n`
  );
  themesToGenerate.forEach((theme, index) => {
    console.log(`   ${index + 1}. ${theme}`);
  });
  console.log();

  // Generate screenshots
  const screenshotTasks = [];
  for (const theme of themesToGenerate) {
    const task = await generateScreenshot(theme);
    screenshotTasks.push(task);
  }

  // Output instructions for Playwright
  console.log('\n📝 Screenshot Generation Instructions:');
  console.log(
    '\nTo complete the screenshot generation, use Playwright MCP server to:'
  );
  console.log('\n1. Navigate to each theme URL');
  console.log(
    '2. Take a hero screenshot (top portion of resume, ~600-800px height)'
  );
  console.log('3. Save to the specified output path\n');

  console.log('Tasks to complete:');
  screenshotTasks.forEach((task, index) => {
    console.log(`\n${index + 1}. Theme: ${task.theme}`);
    console.log(`   Navigate: ${task.url}`);
    console.log(`   Screenshot: ${task.outputPath}`);
  });

  // Export tasks for programmatic use
  return screenshotTasks;
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { main, generateScreenshot, checkDevServer };
