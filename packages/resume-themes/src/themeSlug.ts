import { isTheme } from './render.ts';

/** Misspellings seen in hosted resumes' meta.theme. */
const MISSPELT: Record<string, string> = {
  elegent: 'elegant',
  kandall: 'kendall',
};

/**
 * The gallery slug a resume or address means by a theme: "Elegant",
 * "jsonresume-theme-stackoverflow" (the npm package) and
 * "./themes/jsonresume-theme-kendall" are themes we have. What names none
 * comes back as written, lower-case, for the page that says so.
 */
export const themeSlug = (written: string): string => {
  const plain = written.trim().toLowerCase();
  const name = (plain.split('/').pop() ?? plain)
    .replace(/^jsonresume-theme-/, '')
    .replace(/\s+/g, '-');
  const slug = MISSPELT[name] ?? name;
  return isTheme(slug) ? slug : plain;
};
