/**
 * The recommended themes, printed as /@username.pdf prints them, on A4 and
 * Letter: every word of the sample resume selectable and in reading order,
 * inside the page with a quarter inch to spare, and page one looking as it
 * did when the baseline was drawn. Needs Chromium (playwright-core install
 * chromium-headless-shell) and the network for the themes' web fonts;
 * without Chromium, as in CI's unit tests, these are skipped.
 * UPDATE_PDF_BASELINES=1 redraws the baselines.
 */
import sample from '@jsonresume/sample-data/complete-resume.json';
import { RECOMMENDED_THEMES } from '@jsonresume/theme-metadata';
import { renderTheme } from '@repo/resume-themes';
import { Effect, Layer, ManagedRuntime, Predicate, Schema } from 'effect';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ResumePdf } from './pdf';
import type { Paper } from './policy';
import {
  chromiumInstalled,
  difference,
  drawPage,
  readPdf,
  readThumbnail,
} from './testing';

const resume: Record<string, unknown> = sample;
const papers: ReadonlyArray<Paper> = ['a4', 'letter'];
const baselines = new URL('../baselines/', import.meta.url);
const updating = process.env['UPDATE_PDF_BASELINES'] === '1';
/** Points: a quarter inch, what a desk printer can't reach. */
const MARGIN = 18;
const THUMBNAIL_WIDTH = 120;

/** Lower-case words, split at anything that isn't a letter or digit. */
const words = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1);

const strings = (value: unknown): string[] =>
  Predicate.isString(value)
    ? [value]
    : Array.isArray(value)
    ? value.flatMap(strings)
    : [];

const entries = (value: unknown) =>
  Array.isArray(value) ? value.filter(Predicate.isObject) : [];

/** The fields every theme shows: what must survive printing. */
const shown: Record<string, string[]> = {
  work: ['name', 'position', 'summary', 'highlights'],
  volunteer: ['organization', 'position', 'summary', 'highlights'],
  education: ['institution', 'area', 'studyType', 'courses'],
  awards: ['title', 'awarder', 'summary'],
  certificates: ['name', 'issuer'],
  publications: ['name', 'publisher', 'summary'],
  skills: ['name', 'keywords'],
  languages: ['language', 'fluency'],
  interests: ['name', 'keywords'],
  references: ['name', 'reference'],
  projects: ['name', 'description', 'highlights'],
};
const expected = new Set(
  words(
    [
      ...entries([resume['basics']]).flatMap((basics) =>
        ['name', 'label', 'email', 'phone', 'summary'].flatMap((k) =>
          strings(basics[k])
        )
      ),
      ...Object.entries(shown).flatMap(([section, keys]) =>
        entries(resume[section]).flatMap((entry) =>
          keys.flatMap((k) => strings(entry[k]))
        )
      ),
    ].join(' ')
  )
);

const runtime = ManagedRuntime.make(Layer.fresh(ResumePdf.layer));
const print = (html: string, paper: Paper) =>
  runtime.runPromise(
    Effect.gen(function* () {
      return yield* (yield* ResumePdf).print(html, paper);
    })
  );
const timings: number[] = [];
const run = await chromiumInstalled();

describe('the baselines', () => {
  it('tell themes apart: the tolerance is tighter than a change of theme', async () => {
    const [first = '', second = ''] = RECOMMENDED_THEMES;
    const read = (slug: string) =>
      readFile(new URL(`${slug}.png`, baselines)).then(readThumbnail);
    const change = difference(await read(first), await read(second));
    expect(Math.max(change.mean, change.changed)).toBeGreaterThan(0.02);
  });
});

describe.runIf(run)('the recommended themes in print', () => {
  beforeAll(async () => {
    // Launch the browser first, so print times are the prints alone.
    await print('<p>warm up</p>', 'a4');
    await mkdir(baselines, { recursive: true });
  }, 60_000);
  afterAll(async () => {
    await runtime.dispose();
    const sorted = [...timings].sort((a, b) => a - b);
    const p95 = sorted[Math.ceil(sorted.length * 0.95) - 1] ?? 0;
    // Acceptance (OUT-2): a PDF in under five seconds at the 95th percentile.
    expect(p95).toBeLessThan(5_000);
  });

  describe.each(RECOMMENDED_THEMES)('%s', (slug) => {
    it.each(papers)('prints on %s', { timeout: 60_000 }, async (paper) => {
      const html = await Effect.runPromise(renderTheme(slug, resume));
      const started = performance.now();
      const pdf = await print(html, paper);
      timings.push(performance.now() - started);
      const printed = await readPdf(pdf);
      const page = printed.pages[0];
      // Chromium rounds A4 (595.28pt) to whole pixels.
      expect(
        Math.abs((page?.width ?? 0) - (paper === 'a4' ? 595.28 : 612))
      ).toBeLessThan(1);

      // Every run of text inside the page, clear of its edges.
      const outside = printed.runs.filter(
        ({ page: n, x, y, width, height }) => {
          const size = printed.pages[n - 1] ?? { width: 0, height: 0 };
          return (
            x < MARGIN ||
            x + width > size.width - MARGIN ||
            y < MARGIN ||
            y + height > size.height - MARGIN
          );
        }
      );
      expect(outside.map((r) => `p${r.page}: ${r.text}`)).toEqual([]);

      // Real text, all of it: no icon-font glyphs, no word lost.
      expect(printed.text).not.toMatch(/\p{Co}/u);
      const have = new Set(words(printed.text));
      expect([...expected].filter((w) => !have.has(w))).toEqual([]);

      // In reading order: the name first, then the jobs and schools in turn.
      const flat = printed.text.replace(/\s+/g, ' ').toLowerCase();
      const at = (s: string) => flat.indexOf(s.toLowerCase());
      expect(at(sample.basics.name)).toBeGreaterThanOrEqual(0);
      expect(at(sample.basics.name)).toBeLessThan(100);
      for (const places of [
        sample.work.map((job) => at(job.name)),
        sample.education.map((school) => at(school.institution)),
      ]) {
        expect(places.every((p) => p > 0)).toBe(true);
        expect(places).toEqual([...places].sort((a, b) => a - b));
      }

      // As it was: the same number of pages and, on A4, page one looking
      // the same (a thumbnail, so fonts' fine detail doesn't count).
      const counts = new URL('pages.json', baselines);
      const pages = Schema.decodeUnknownSync(
        Schema.Record(Schema.String, Schema.Number)
      )(existsSync(counts) ? JSON.parse(await readFile(counts, 'utf8')) : {});
      const key = `${slug}.${paper}`;
      const base = new URL(`${slug}.png`, baselines);
      const drawn =
        paper === 'a4' ? await drawPage(pdf, 1, THUMBNAIL_WIDTH) : undefined;
      if (updating) {
        if (drawn) await writeFile(base, drawn.png);
        const next = { ...pages, [key]: printed.pages.length };
        await writeFile(counts, `${JSON.stringify(next, null, 2)}\n`);
        return;
      }
      expect(pages[key], 'no baseline: UPDATE_PDF_BASELINES=1').toBe(
        printed.pages.length
      );
      if (!drawn) return;
      const change = difference(
        drawn.thumbnail,
        await readThumbnail(await readFile(base))
      );
      expect(change.mean).toBeLessThan(0.02);
      expect(change.changed).toBeLessThan(0.02);
    });
  });
});
