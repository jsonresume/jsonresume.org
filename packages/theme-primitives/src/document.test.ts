import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { sectionCoverage } from '@jsonresume/theme-kit';
import { createTheme } from '../dist/index.js';
import type { ThemeOptions } from './types';

const complete: unknown = createRequire(import.meta.url)(
  '@jsonresume/sample-data/complete-resume.json'
);
const options: ThemeOptions = {
  slug: 'test',
  className: 'test',
  layout: 'right',
  fonts: [],
  css: '',
};
const render = createTheme(options);
const document = (resume: unknown) => new JSDOM(render(resume)).window.document;

describe('published document renderer', () => {
  it('renders every section and leaves the input untouched', () => {
    const before = JSON.stringify(complete);
    const html = render(complete);
    expect(Object.values(sectionCoverage(html)).every(Boolean)).toBe(true);
    expect(JSON.stringify(complete)).toBe(before);
    expect(html).not.toContain('__JSONRESUME_INLINE_CSS__');
    expect(html).toContain('@page');
  });

  it('escapes text in both the document and its title and blocks executable links', () => {
    const doc = document({
      basics: {
        name: '</title><script>alert(1)</script>',
        url: 'javascript:alert(2)',
        profiles: [{ network: 'Unsafe', url: 'data:text/html,unsafe' }],
      },
      projects: [
        { name: '<img src=x onerror=alert(3)>', url: 'file:///etc/passwd' },
      ],
    });
    expect(doc.querySelector('script')).toBeNull();
    expect(doc.querySelector('h1')?.textContent).toBe(
      '</title><script>alert(1)</script>'
    );
    expect(doc.title).toContain('</title><script>alert(1)</script>');
    expect(doc.querySelector('a')).toBeNull();
  });

  it('keeps dates with jobs, preserves year precision, and does not invent ongoing education', () => {
    const doc = document({
      work: [{ name: 'Acme', position: 'Engineer', startDate: '2021' }],
      education: [{ institution: 'University', startDate: '2019-05' }],
    });
    expect(
      doc.querySelector('[data-section="work"] article')?.textContent
    ).toContain('2021 – Present');
    expect(
      doc.querySelector('[data-section="education"]')?.textContent
    ).toContain('May 2019');
    expect(
      doc.querySelector('[data-section="education"]')?.textContent
    ).not.toContain('Present');
  });

  it('handles malformed optional fields without artifacts or empty sections', () => {
    const html = render({
      basics: { name: 'Ada', location: null, profiles: [null] },
      work: [null, {}, { position: 'Researcher', location: { city: 'Paris' } }],
      projects: 'wrong',
      skills: [{ name: 'Code', keywords: [null, {}, 'TypeScript'] }],
    });
    expect(html).not.toMatch(/\[object Object\]|\bundefined\b|\bNaN\b/);
    expect(html).toContain('Paris');
    expect(html).toContain('TypeScript');
    expect(html).not.toContain('data-section="projects"');
  });

  it('applies section preferences without dropping unspecified sections', () => {
    const doc = document({
      basics: { name: 'Ada' },
      work: [{ name: 'Acme' }],
      education: [{ institution: 'University' }],
      skills: [{ name: 'Math' }],
      meta: {
        researchThemes: {
          layout: 'single',
          sectionOrder: ['skills', 'skills', 'unknown'],
        },
      },
    });
    expect(doc.querySelector('main')?.getAttribute('data-layout')).toBe(
      'single'
    );
    expect(
      [...doc.querySelectorAll('section')].map((s) =>
        s.getAttribute('data-section')
      )
    ).toEqual(['skills', 'work', 'education']);
    expect(doc.querySelector('aside')).toBeNull();
  });

  it('localises labels and identifies fallback headings', () => {
    const french = document({
      work: [{ name: 'Acme', startDate: '2020-01' }],
      meta: { language: 'fr-FR' },
    });
    expect(french.documentElement.lang).toBe('fr-FR');
    expect(french.querySelector('h2')?.textContent).toBe('Expérience');
    expect(french.body.textContent).toContain('Aujourd’hui');
    const persian = document({
      skills: [{ name: 'البرمجة' }],
      meta: { language: 'fa' },
    });
    expect(persian.documentElement.dir).toBe('rtl');
    expect(persian.querySelector('h2')?.lang).toBe('en');
  });

  it('makes photos and full street addresses explicit opt-ins', () => {
    const basics = {
      name: 'Ada',
      image: 'https://example.com/ada.jpg',
      location: { address: '12 Secret Road', city: 'London' },
    };
    const plain = document({ basics });
    expect(plain.querySelector('img')).toBeNull();
    expect(plain.body.textContent).not.toContain('Secret Road');
    const opted = document({
      basics,
      meta: { researchThemes: { showPhoto: true, showFullAddress: true } },
    });
    expect(opted.querySelector('img')?.getAttribute('src')).toBe(basics.image);
    expect(opted.body.textContent).toContain('12 Secret Road');
  });

  it('normalises Date objects and recovers from malformed locale preferences', () => {
    const doc = document({
      work: [{ name: 'Acme', startDate: new Date('2021-03-01T00:00:00Z') }],
      certificates: [
        { name: 'Certificate', date: new Date('2022-05-01T00:00:00Z') },
      ],
      meta: { language: 'en-12' },
    });
    expect(doc.documentElement.lang).toBe('en');
    expect(doc.body.textContent).toContain('Mar 2021');
    expect(doc.body.textContent).toContain('May 2022');
  });
});
