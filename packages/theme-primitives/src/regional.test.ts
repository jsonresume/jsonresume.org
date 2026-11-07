import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { createTheme } from '../dist/index.js';
import type { ThemeOptions } from './types';
const base: ThemeOptions = {
  slug: 'regional-test',
  className: 'test',
  layout: 'balanced',
  fonts: [],
  css: '',
};
const resume = {
  basics: { name: 'ليلى · 田中 · 김민서 · आशा' },
  work: [{ position: 'Engineer', name: 'Acme', startDate: '2022' }],
  skills: [{ name: 'TypeScript' }],
};

describe('regional defaults and balanced reading order', () => {
  it.each([
    ['ar', 'rtl', 'الخبرة المهنية'],
    ['ja', 'ltr', '職歴'],
    ['hi', 'ltr', 'अनुभव'],
    ['ko', 'ltr', '경력'],
    ['pt', 'ltr', 'Experiência'],
  ])(
    'uses %s labels while retaining supplied applicant content',
    (language, direction, heading) => {
      const doc = new JSDOM(
        createTheme({ ...base, defaultLanguage: language })(resume)
      ).window.document;
      expect(doc.documentElement.lang).toBe(language);
      expect(doc.documentElement.dir).toBe(direction);
      expect(doc.querySelector('h1')?.textContent).toBe(resume.basics.name);
      expect(doc.querySelector('h2')?.textContent).toBe(heading);
      expect(doc.querySelector('main')?.dataset.layout).toBe('balanced');
      expect(doc.querySelectorAll('aside')).toHaveLength(1);
    }
  );
  it('lets the applicant override the regional language and column preference', () => {
    const html = createTheme({ ...base, defaultLanguage: 'ar' })({
      ...resume,
      meta: { language: 'fr', researchThemes: { layout: 'single' } },
    });
    const doc = new JSDOM(html).window.document;
    expect(doc.documentElement.lang).toBe('fr');
    expect(doc.documentElement.dir).toBe('ltr');
    expect(doc.querySelector('h2')?.textContent).toBe('Expérience');
    expect(doc.querySelector('aside')).toBeNull();
    expect(doc.querySelector('main')?.dataset.layout).toBe('single');
  });
});
