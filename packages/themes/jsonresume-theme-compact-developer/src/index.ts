import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'compact-developer',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['DM Sans:wght@400;600;700'],
  sectionOrder: ['projects', 'skills', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
