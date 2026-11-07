import { validateATS } from '@jsonresume/ats-validator';
import { RECOMMENDED_THEMES, THEME_METADATA } from '@jsonresume/theme-metadata';
import { Effect, Schema } from 'effect';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { renderTheme, ResumeDocument, themeSlugs } from './render.ts';

const require = createRequire(import.meta.url);
const sample = require('@jsonresume/sample-data/complete-resume.json');
const resume = Schema.decodeUnknownSync(ResumeDocument)(sample);
const { name, email, phone } = sample.basics;

/**
 * The page's text, as a tracking system that strips the markup reads it.
 * Line-break hints (<wbr>) inside addresses join, as they do on the page.
 */
const textOf = (html: string) =>
  html
    .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<wbr\s*\/?>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');

const headings = (html: string, level: string) =>
  [
    ...html.matchAll(
      new RegExp(`<h${level}[\\s>][\\s\\S]*?</h${level}>`, 'gi')
    ),
  ].map((m) => textOf(m[0]).trim());

describe('the recommended themes', () => {
  it('are about a dozen gallery themes, flagged in their metadata', () => {
    expect(RECOMMENDED_THEMES.length).toBeGreaterThanOrEqual(10);
    expect(RECOMMENDED_THEMES.length).toBeLessThanOrEqual(15);
    expect(new Set(RECOMMENDED_THEMES).size).toBe(RECOMMENDED_THEMES.length);
    for (const slug of RECOMMENDED_THEMES) {
      expect(themeSlugs, slug).toContain(slug);
      expect(THEME_METADATA[slug]?.recommended, slug).toBe(true);
      // One reading column, or a date gutter beside it: no sidebars.
      expect(['single', 'dates'], slug).toContain(THEME_METADATA[slug]?.layout);
    }
    expect(
      Object.values(THEME_METADATA).filter((theme) => theme.recommended)
    ).toHaveLength(RECOMMENDED_THEMES.length);
  });

  describe.each(RECOMMENDED_THEMES)('%s', (slug) => {
    const html = () => Effect.runPromise(renderTheme(slug, resume));

    it('passes the ATS check with no errors', { timeout: 30_000 }, async () => {
      const report = validateATS(await html());
      expect(report.score).toBeGreaterThanOrEqual(90);
      expect(report.issues.filter((i) => i.severity === 'error')).toEqual([]);
      for (const check of [
        'Semantic HTML',
        'No Table Layouts',
        'Heading Structure',
        'Image Accessibility',
        'Contact Information',
        'Special Characters',
      ])
        expect(report.checks.find((c) => c.name === check)?.passed, check).toBe(
          true
        );
    });

    it('reads as plain text: name, contact, standard headings, no images or tables', async () => {
      const page = await html();
      expect(headings(page, '1')).toEqual([name]);
      const sections = [...headings(page, '2'), ...headings(page, '3')].join(
        ' | '
      );
      expect(sections).toMatch(/experience|work/i);
      expect(sections).toMatch(/education/i);
      expect(sections).toMatch(/skills/i);
      const text = textOf(page);
      expect(text).toContain(email);
      expect(text).toContain(phone);
      for (const job of sample.work) {
        expect(text).toContain(job.name);
        expect(text).toContain(job.position);
      }
      expect(page).not.toMatch(/<(img|table|canvas)[\s>]/i);
      expect(page).not.toMatch(/font-?awesome|material-icons|icomoon/i);
    });
  });
});
