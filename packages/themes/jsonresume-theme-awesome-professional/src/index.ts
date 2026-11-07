import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'awesome-professional',
  className: design,
  layout: 'single',
  fonts: ['Roboto:wght@400;500;700', 'Roboto Slab:wght@400;600'],
  css: '__JSONRESUME_INLINE_CSS__',
});
const theme = { render };
export default theme;
