import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'skills-first',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Inter:wght@400;600;700'],
  sectionOrder: ['skills', 'projects', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
