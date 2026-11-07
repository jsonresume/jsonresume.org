import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'indic-modern',
  layout: 'single',
  defaultLanguage: 'hi',
  fonts: ['Noto Sans Devanagari:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
