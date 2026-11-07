import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'academic-classic',
  className: design,
  layout: 'academic',
  fonts: ['PT Serif:wght@400;700', 'PT Sans:wght@400;700'],
  css: '__JSONRESUME_INLINE_CSS__',
  sectionOrder: [
    'education',
    'work',
    'publications',
    'projects',
    'awards',
    'certificates',
    'volunteer',
    'skills',
    'languages',
    'interests',
    'references',
  ],
});
const theme = { render };
export default theme;
