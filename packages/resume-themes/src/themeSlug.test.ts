import { expect, it } from 'vitest';
import { themeSlug } from './themeSlug.ts';

it('reads the theme a resume means by its npm name, path, spacing or a misspelling', () => {
  expect(themeSlug('Elegant')).toBe('elegant');
  expect(themeSlug('jsonresume-theme-stackoverflow')).toBe('stackoverflow');
  expect(themeSlug('./themes/jsonresume-theme-kendall')).toBe('kendall');
  expect(themeSlug('elegent')).toBe('elegant');
  expect(themeSlug('kandall')).toBe('kendall');
  // Names no theme: kept, for the page that says so.
  expect(themeSlug('Spartan')).toBe('spartan');
  expect(themeSlug('jsonresume-theme-even-crewshin')).toBe(
    'jsonresume-theme-even-crewshin'
  );
});
