import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'blackline',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['League Spartan:wght@400;600;700', 'Lato:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
