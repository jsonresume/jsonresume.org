import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'research-engineer',
  layout: 'academic',
  defaultLanguage: 'en',
  fonts: ['Space Mono:wght@400;700', 'Public Sans:wght@400;600;700'],
  sectionOrder: ['projects', 'publications', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
