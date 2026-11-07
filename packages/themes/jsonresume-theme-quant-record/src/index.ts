import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'quant-record',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Roboto Slab:wght@400;600;700', 'Inter:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
