import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'arabic-modern',
  layout: 'right',
  defaultLanguage: 'ar',
  fonts: ['Noto Sans Arabic:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
