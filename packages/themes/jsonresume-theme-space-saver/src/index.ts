import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'space-saver',
  layout: 'balanced',
  defaultLanguage: 'en',
  fonts: ['DM Sans:wght@400;600;700'],
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
