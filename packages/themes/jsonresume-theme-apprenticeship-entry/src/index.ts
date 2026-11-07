import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'apprenticeship-entry',
  layout: 'left',
  defaultLanguage: 'en',
  fonts: ['Source Sans 3:wght@400;600;700'],
  sectionOrder: ['education', 'work', 'projects'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
