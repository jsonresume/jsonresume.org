import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'academy-record',
  layout: 'academic',
  defaultLanguage: 'en',
  fonts: ['Source Serif 4:wght@400;600;700', 'Source Sans 3:wght@400;600;700'],
  sectionOrder: ['education', 'publications', 'work', 'awards'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
