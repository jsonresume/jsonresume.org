import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'first-role',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['IBM Plex Sans:wght@400;600;700'],
  sectionOrder: ['education', 'projects', 'volunteer', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
