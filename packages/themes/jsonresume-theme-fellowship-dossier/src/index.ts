import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'fellowship-dossier',
  layout: 'academic',
  defaultLanguage: 'en',
  fonts: ['Crimson Pro:wght@400;600;700', 'Work Sans:wght@400;600;700'],
  sectionOrder: ['education', 'publications', 'awards', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
