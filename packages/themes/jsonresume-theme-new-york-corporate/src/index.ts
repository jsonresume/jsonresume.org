import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'new-york-corporate',
  className: design,
  layout: 'timeline',
  fonts: ['Libre Caslon Text:wght@400;700', 'Source Sans 3:wght@400;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
