import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'alta',
  className: design,
  layout: 'achievement',
  fonts: ['Lato:wght@400;700', 'Merriweather Sans:wght@400;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
  sidebarSections: [
    'awards',
    'skills',
    'languages',
    'interests',
    'certificates',
  ],
});
const theme = { render };
export default theme;
