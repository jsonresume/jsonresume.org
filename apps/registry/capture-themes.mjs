import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const themes = [
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
];

const baseUrl = 'http://localhost:3000/thomasdavis';
const outputDir = '/tmp';

async function captureTheme(browser, themeName) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  const url = `${baseUrl}?theme=${themeName}`;

  console.log(`[${themeName}] Navigating to ${url}...`);

  try {
    // Navigate and wait for network to be idle
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait a bit more for any dynamic content
    await page.waitForTimeout(2000);

    // Check if there's an error message on the page
    const errorElement = await page.$('.error, [class*="error"]');
    const buildError = await page.$('text=/build error/i');

    if (errorElement || buildError) {
      const errorText = errorElement
        ? await errorElement.textContent()
        : await buildError?.textContent();
      console.log(
        `[${themeName}] ⚠️  Error detected: ${errorText?.substring(0, 100)}`
      );
    }

    // Get the page title for verification
    const title = await page.title();

    // Take full page screenshot
    const screenshotPath = join(outputDir, `theme-${themeName}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`[${themeName}] ✅ Screenshot saved to ${screenshotPath}`);

    await context.close();

    return {
      theme: themeName,
      success: true,
      url,
      title,
      screenshotPath,
      error: null,
    };
  } catch (error) {
    console.error(`[${themeName}] ❌ Failed: ${error.message}`);
    await context.close();

    return {
      theme: themeName,
      success: false,
      url,
      title: null,
      screenshotPath: null,
      error: error.message,
    };
  }
}

async function main() {
  console.log('🚀 Starting theme screenshot capture...\n');

  const browser = await chromium.launch({ headless: true });

  // Capture all themes in parallel
  const results = await Promise.all(
    themes.map((theme) => captureTheme(browser, theme))
  );

  await browser.close();

  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('📊 THEME SCREENSHOT REPORT');
  console.log('='.repeat(80) + '\n');

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(
    `✅ Successfully rendered: ${successful.length}/${themes.length}`
  );
  console.log(`❌ Failed: ${failed.length}/${themes.length}\n`);

  if (successful.length > 0) {
    console.log('SUCCESSFUL THEMES:');
    console.log('-'.repeat(80));
    successful.forEach((r) => {
      console.log(`  ✅ ${r.theme}`);
      console.log(`     URL: ${r.url}`);
      console.log(`     Screenshot: ${r.screenshotPath}`);
      console.log(`     Title: ${r.title}\n`);
    });
  }

  if (failed.length > 0) {
    console.log('\nFAILED THEMES:');
    console.log('-'.repeat(80));
    failed.forEach((r) => {
      console.log(`  ❌ ${r.theme}`);
      console.log(`     URL: ${r.url}`);
      console.log(`     Error: ${r.error}\n`);
    });
  }

  // Save JSON report
  const reportPath = join(outputDir, 'theme-screenshot-report.json');
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(console.error);
