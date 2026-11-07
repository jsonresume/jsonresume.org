import { AxeBuilder } from '@axe-core/playwright';
import { Effect } from 'effect';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { renderTheme } from '../packages/resume-themes/src/index.ts';
import { researchedSlugs, themeFixtures } from './researched-theme-fixtures.ts';

const out = resolve('output/researched-themes');
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
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1060 },
  });
  const page = await context.newPage();
  for (const slug of researchedSlugs) {
    const folder = resolve(out, slug);
    await mkdir(folder, { recursive: true });
    for (const [fixture, resume] of Object.entries(fixtures)) {
      const html = await Effect.runPromise(renderTheme(slug, resume));
      await writeFile(resolve(folder, `${fixture}.html`), html);
      for (const width of fixture === 'complete' || fixture === 'wrapping'
        ? [320, 390, 640, 768, 1280]
        : [390, 1280]) {
        await page.setViewportSize({ width, height: 1060 });
        await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });
        await page.evaluate(() => document.fonts.ready);
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
              problems.push(`Overflow: ${element.textContent?.slice(0, 65)}`);
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
              .toFile(resolve('apps/app/public/img/themes', `${slug}.webp`));
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
      if (fixture === 'complete' || fixture === 'dense') {
        await page.setViewportSize({ width: 1280, height: 1060 });
        for (const format of ['A4', 'Letter'] as const) {
          const width = format === 'A4' ? 673 : 695;
          await page.setViewportSize({ width, height: 1000 });
          await page.emulateMedia({ media: 'print' });
          const issues = await page.evaluate(() =>
            [...document.querySelectorAll('h1,h2,h3,p,li,dt,dd')]
              .filter(
                (element) =>
                  element.getBoundingClientRect().right > innerWidth + 1 ||
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
  }
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
