import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'jake-technical',
  className: design,
  layout: 'single',
  fonts: ['Libre Franklin:wght@400;500;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
