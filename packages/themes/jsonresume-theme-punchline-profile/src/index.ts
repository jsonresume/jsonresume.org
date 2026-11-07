import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'punchline-profile',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Oswald:wght@400;600;700', 'Source Sans 3:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
