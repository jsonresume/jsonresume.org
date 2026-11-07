import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'stewardship-cv',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['EB Garamond:wght@400;600;700', 'Lato:wght@400;600;700'],
  sectionOrder: ['work', 'volunteer', 'projects'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
