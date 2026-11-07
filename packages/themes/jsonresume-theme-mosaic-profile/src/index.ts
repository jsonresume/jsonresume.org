import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'mosaic-profile',
  layout: 'balanced',
  defaultLanguage: 'en',
  fonts: ['Bricolage Grotesque:wght@400;600;700', 'Figtree:wght@400;600;700'],
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
