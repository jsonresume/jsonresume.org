import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'bubblegum-minimal',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Space Mono:wght@400;700', 'DM Sans:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
