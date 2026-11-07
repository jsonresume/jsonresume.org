import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'accessible-large-type',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Atkinson Hyperlegible:wght@400;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
