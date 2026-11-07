import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'independent-consultant',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['DM Serif Display:wght@400', 'DM Sans:wght@400;600;700'],
  sectionOrder: ['projects', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
