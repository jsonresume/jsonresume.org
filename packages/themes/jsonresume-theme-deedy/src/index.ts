import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'deedy',
  className: design,
  layout: 'deedy',
  fonts: ['Lato:wght@400;700', 'Raleway:wght@400;600;700'],
  css: '__JSONRESUME_INLINE_CSS__',
  sidebarSections: [
    'education',
    'skills',
    'languages',
    'interests',
    'certificates',
  ],
});
const theme = { render };
export default theme;
