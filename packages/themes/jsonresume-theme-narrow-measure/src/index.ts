import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'narrow-measure',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Source Sans 3:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
