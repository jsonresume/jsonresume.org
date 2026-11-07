import { Effect, ManagedRuntime } from 'effect';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import {
  renderTheme,
  themeSlugs,
} from '../packages/resume-themes/src/index.ts';
import { mayLoad } from '../packages/resume-pdf/src/policy.ts';
import { ResumePdf } from '../packages/resume-pdf/src/pdf.ts';
import { themeFixtures } from './researched-theme-fixtures.ts';
import { regionalFixture } from './theme-portfolio/regional-fixtures.ts';

/** Exercise the hosted renderer with the exporter's scripts-off print policy. */
const selected = process.argv
  .find((arg) => arg.startsWith('--themes='))
  ?.slice(9)
  .split(',');
const queue = themeSlugs.filter((slug) => !selected || selected.includes(slug));
if (!queue.length || selected?.some((slug) => !themeSlugs.includes(slug)))
  throw new Error('Select registered themes; an empty print audit is invalid.');
const root = resolve('output/all-theme-pdfs');
const fixtures = await themeFixtures();
const exporter = process.argv.includes('--exporter');
const runtime = ManagedRuntime.make(ResumePdf.layer);
const printer = exporter ? await runtime.runPromise(ResumePdf) : undefined;
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const results: Record<string, unknown>[] = [];
await mkdir(root, { recursive: true });
try {
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      for (let slug; (slug = queue.shift()); ) {
        const context = await browser.newContext({ javaScriptEnabled: false });
        try {
          await context.route('**/*', async (route) =>
            (await mayLoad(route.request().url()))
              ? route.continue()
              : route.abort()
          );
          const page = await context.newPage();
          const folder = resolve(root, slug);
          await mkdir(folder, { recursive: true });
          for (const [fixture, resume] of Object.entries({
            complete: fixtures.complete ?? {},
            dense: fixtures.dense ?? {},
            sparse: fixtures.sparse ?? {},
            wrapping: fixtures.wrapping ?? {},
            ...regionalFixture(slug),
          })) {
            const html = await Effect.runPromise(renderTheme(slug, resume));
            await writeFile(resolve(folder, `${fixture}.html`), html);
            if (printer) {
              for (const format of ['A4', 'Letter'] as const) {
                const pdf = await runtime.runPromise(
                  printer.print(html, format === 'A4' ? 'a4' : 'letter')
                );
                await writeFile(
                  resolve(folder, `${fixture}-${format}.pdf`),
                  pdf
                );
                results.push({ theme: slug, fixture, format });
              }
              continue;
            }
            await page
              .setContent(html, { waitUntil: 'networkidle', timeout: 15_000 })
              .catch(() => {});
            await page.emulateMedia({ media: 'print' });
            await page.evaluate(() => document.fonts.ready);
            for (const format of ['A4', 'Letter'] as const) {
              await page.setViewportSize({
                width: format === 'A4' ? 794 : 816,
                height: 1123,
              });
              const diagnostics = await page.evaluate(() => {
                const hidden: string[] = [];
                const text: string[] = [];
                for (const el of document.querySelectorAll(
                  'h1,h2,h3,p,li,dt,dd'
                )) {
                  const value = el.textContent?.trim();
                  if (!value) continue;
                  const style = getComputedStyle(el);
                  if (
                    style.display === 'none' ||
                    style.visibility === 'hidden' ||
                    Number(style.opacity) === 0
                  )
                    hidden.push(value.slice(0, 90));
                }
                const walker = document.createTreeWalker(
                  document.body,
                  NodeFilter.SHOW_TEXT
                );
                while (walker.nextNode()) {
                  const node = walker.currentNode;
                  const parent = node.parentElement;
                  if (!parent || parent.closest('script,style,noscript'))
                    continue;
                  if (parent.checkVisibility({ visibilityProperty: true }))
                    text.push(node.textContent ?? '');
                }
                return { hidden, text };
              });
              await page.pdf({
                path: resolve(folder, `${fixture}-${format}.pdf`),
                format,
                printBackground: true,
                preferCSSPageSize: true,
              });
              results.push({ theme: slug, fixture, format, ...diagnostics });
            }
          }
          process.stdout.write(`${slug}: print matrix complete\n`);
        } catch (error) {
          results.push({ theme: slug, error: String(error) });
        } finally {
          await context.close();
        }
      }
    })
  );
} finally {
  await browser.close();
  await runtime.dispose();
}
if (results.some((result) => result.error)) process.exitCode = 1;
const file = selected
  ? 'browser-results-selected.json'
  : 'browser-results.json';
await writeFile(resolve(root, file), JSON.stringify(results, null, 2));
process.stdout.write(
  `${results.length} print cases; ${
    results.filter((r) => r.error).length
  } runtime failures.\n`
);
