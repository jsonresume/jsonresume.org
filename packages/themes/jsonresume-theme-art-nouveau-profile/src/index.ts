import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'art-nouveau-profile',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['DM Serif Display:wght@400', 'Work Sans:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
