import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'signal-red',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Barlow Condensed:wght@400;600;700', 'Public Sans:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
