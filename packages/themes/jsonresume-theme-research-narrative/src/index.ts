import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'research-narrative',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Libre Caslon Display:wght@400', 'Literata:wght@400;600;700'],
  sectionOrder: ['education', 'publications', 'projects', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
