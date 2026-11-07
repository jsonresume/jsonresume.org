import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'build-log',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['IBM Plex Mono:wght@400;600;700', 'IBM Plex Sans:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
