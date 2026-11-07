import { Effect } from 'effect';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { THEME_NAMES } from '../../packages/theme-config/src/index.js';
import { renderTheme } from '../../packages/resume-themes/src/index.ts';
import { themeFixtures } from '../researched-theme-fixtures.ts';
import { portfolioIdeas } from './ideas.ts';

const added = new Set(portfolioIdeas().map((idea) => idea.slug));
const selected = process.argv
  .find((arg) => arg.startsWith('--themes='))
  ?.slice(9)
  .split(',');
const queue = THEME_NAMES.filter(
  (slug) => !added.has(slug) && (!selected || selected.includes(slug))
);
const { complete = {} } = await themeFixtures();
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const issues: { theme: string; error: string }[] = [];
try {
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 1060 },
      });
      for (let slug; (slug = queue.shift()); ) {
        try {
          const folder = resolve('output/existing-theme-previews', slug);
          await mkdir(folder, { recursive: true });
          const html = await Effect.runPromise(renderTheme(slug, complete));
          await writeFile(resolve(folder, 'complete.html'), html);
          await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });
          await page.evaluate(() => document.fonts.ready);
          // This legacy theme intentionally fades its document in after load.
          if (slug === 'tan-responsive') await page.waitForTimeout(5000);
          const shot = await page.screenshot({
            path: resolve(folder, 'desktop.png'),
          });
          await sharp(shot)
            .resize(800, 640, { fit: 'cover', position: 'top' })
            .webp({ quality: 86 })
            .toFile(resolve('apps/app/public/img/themes', `${slug}.webp`));
          await sharp(shot)
            .resize(800, 640, { fit: 'cover', position: 'top' })
            .png()
            .toFile(resolve('apps/homepage2/public/img/themes', `${slug}.png`));
          process.stdout.write(`${slug}: refreshed from the hosted renderer\n`);
        } catch (error) {
          issues.push({ theme: slug, error: String(error) });
        }
      }
      await page.close();
    })
  );
} finally {
  await browser.close();
}
process.stdout.write(JSON.stringify({ issues }) + '\n');
if (issues.length) process.exitCode = 1;
