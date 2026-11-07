import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'cjk-modern',
  layout: 'single',
  defaultLanguage: 'ja',
  fonts: ['Noto Sans JP:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
