import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'harvard-classic',
  className: design,
  layout: 'single',
  fonts: ['Libre Baskerville:wght@400;700'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
