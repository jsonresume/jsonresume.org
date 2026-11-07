import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'engineering-matrix',
  layout: 'balanced',
  defaultLanguage: 'en',
  fonts: ['Roboto Slab:wght@400;600;700', 'Source Sans 3:wght@400;600;700'],
  sidebarSections: [
    'education',
    'skills',
    'certificates',
    'languages',
    'interests',
    'awards',
  ],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
