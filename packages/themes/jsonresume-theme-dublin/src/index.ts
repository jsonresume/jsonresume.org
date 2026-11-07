import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'dublin',
  className: design,
  layout: 'left',
  fonts: ['Public Sans:wght@400;500;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
