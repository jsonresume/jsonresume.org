import { AxeBuilder } from '@axe-core/playwright';
import { Effect } from 'effect';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { renderTheme } from '../packages/resume-themes/src/index.ts';
import { researchedSlugs, themeFixtures } from './researched-theme-fixtures.ts';
import { portfolioIdeas } from './theme-portfolio/ideas.ts';
import { themeBuildReady } from './theme-portfolio/build-ready.ts';
import { regionalFixture } from './theme-portfolio/regional-fixtures.ts';

const portfolio = process.argv.includes('--portfolio');
const waiting = process.argv.includes('--wait-for-build');
const availableSlugs = portfolio
  ? portfolioIdeas().map((idea) => idea.slug)
  : researchedSlugs;
const selected = process.argv
  .find((arg) => arg.startsWith('--themes='))
  ?.slice(9)
  .split(',');
const slugs = selected
  ? availableSlugs.filter((slug) => selected.includes(slug))
  : availableSlugs;
const out = resolve(
  portfolio ? 'output/theme-portfolio' : 'output/researched-themes'
);
await mkdir(out, { recursive: true });
const fixtures = await themeFixtures();
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const results: {
  theme: string;
  fixture: string;
  width: number;
  issues: string[];
}[] = [];
const gallery = process.argv.includes('--gallery');

try {
  const queue = [...slugs];
  await Promise.all(
    Array.from({ length: portfolio ? 2 : 1 }, async () => {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 1060 },
      });
      const page = await context.newPage();
      for (let slug; (slug = queue.shift()); ) {
        try {
          if (waiting) await themeBuildReady(slug);
          const folder = resolve(out, slug);
          await mkdir(folder, { recursive: true });
          for (const [fixture, resume] of Object.entries({
            ...fixtures,
            ...regionalFixture(slug),
          })) {
            const html = await Effect.runPromise(renderTheme(slug, resume));
            await writeFile(resolve(folder, `${fixture}.html`), html);
            await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });
            await page.evaluate(() => document.fonts.ready);
            for (const width of fixture === 'complete' || fixture === 'wrapping'
              ? [320, 390, 640, 768, 1280]
              : [390, 1280]) {
              await page.setViewportSize({ width, height: 1060 });
              const issues = await page.evaluate(() => {
                const problems: string[] = [];
                if (document.documentElement.scrollWidth > innerWidth + 1)
                  problems.push('Horizontal page overflow');
                if (document.querySelectorAll('h1').length !== 1)
                  problems.push('Expected exactly one h1');
                for (const element of document.querySelectorAll(
                  'h1,h2,h3,p,li,dt,dd'
                )) {
                  const box = element.getBoundingClientRect();
                  if (box.right > innerWidth + 1 || box.left < -1)
                    problems.push(
                      `Overflow: ${element.textContent?.slice(0, 65)}`
                    );
                  if (element.scrollWidth > element.clientWidth + 2)
                    problems.push(
                      `Clipped text: ${element.textContent?.slice(0, 65)}`
                    );
                }
                return [...new Set(problems)];
              });
              if (fixture === 'complete' && width === 1280) {
                const accessibility = await new AxeBuilder({ page })
                  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
                  .analyze();
                issues.push(
                  ...accessibility.violations.map(
                    (v) => `Accessibility: ${v.id} (${v.nodes.length} nodes)`
                  )
                );
                await page.screenshot({
                  path: resolve(folder, 'desktop.png'),
                  fullPage: true,
                });
                if (gallery) {
                  const shot = await page.screenshot();
                  await sharp(shot)
                    .resize(800, 640, { fit: 'cover', position: 'top' })
                    .webp({ quality: 86 })
                    .toFile(
                      resolve('apps/app/public/img/themes', `${slug}.webp`)
                    );
                  await sharp(shot)
                    .resize(800, 640, { fit: 'cover', position: 'top' })
                    .png()
                    .toFile(
                      resolve('apps/homepage2/public/img/themes', `${slug}.png`)
                    );
                }
              }
              if (fixture === 'complete' && width === 390)
                await page.screenshot({
                  path: resolve(folder, 'mobile.png'),
                  fullPage: true,
                });
              results.push({ theme: slug, fixture, width, issues });
            }
            if (
              fixture === 'complete' ||
              fixture === 'dense' ||
              fixture === 'regional'
            ) {
              await page.setViewportSize({ width: 1280, height: 1060 });
              for (const format of ['A4', 'Letter'] as const) {
                const width = format === 'A4' ? 673 : 695;
                await page.setViewportSize({ width, height: 1000 });
                await page.emulateMedia({ media: 'print' });
                const issues = await page.evaluate(() =>
                  [...document.querySelectorAll('h1,h2,h3,p,li,dt,dd')]
                    .filter(
                      (element) =>
                        element.getBoundingClientRect().right >
                          innerWidth + 1 ||
                        element.getBoundingClientRect().left < -1
                    )
                    .map(
                      (element) =>
                        `Print overflow: ${element.textContent?.slice(0, 65)}`
                    )
                );
                results.push({
                  theme: slug,
                  fixture: `${fixture}-${format}-print`,
                  width,
                  issues,
                });
                await page.pdf({
                  path: resolve(folder, `${fixture}-${format}.pdf`),
                  format,
                  printBackground: true,
                  preferCSSPageSize: false,
                });
              }
              await page.emulateMedia({ media: null });
            }
          }
          // The fallback must remain readable when external fonts are unavailable.
          await page.route('https://fonts.googleapis.com/**', (route) =>
            route.abort()
          );
          const html = await Effect.runPromise(
            renderTheme(slug, fixtures.complete ?? {})
          );
          await page.setContent(html, { waitUntil: 'load' });
          await page.screenshot({
            path: resolve(folder, 'font-fallback.png'),
            fullPage: true,
          });
          await page.unroute('https://fonts.googleapis.com/**');
          process.stdout.write(`${slug}: browser and PDF matrix complete\n`);
        } catch (error) {
          results.push({
            theme: slug,
            fixture: 'runtime',
            width: 0,
            issues: [String(error)],
          });
        }
      }
      await context.close();
    })
  );
} finally {
  await browser.close();
}
await writeFile(
  resolve(out, 'browser-results.json'),
  JSON.stringify(results, null, 2)
);
const failures = results.filter((result) => result.issues.length);
process.stdout.write(
  `${results.length} browser cases; ${failures.length} with issues.\n`
);
if (failures.length) {
  process.stdout.write(`${JSON.stringify(failures, null, 2)}\n`);
  process.exitCode = 1;
}
