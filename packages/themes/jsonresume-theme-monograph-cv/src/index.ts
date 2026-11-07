import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'monograph-cv',
  layout: 'academic',
  defaultLanguage: 'en',
  fonts: ['DM Serif Display:wght@400', 'Source Sans 3:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
