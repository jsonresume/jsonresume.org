import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'oblique-resume',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Anton:wght@400', 'Inter:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
