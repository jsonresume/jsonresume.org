import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'europass-inspired',
  className: design,
  layout: 'european',
  fonts: ['Source Sans 3:wght@400;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
