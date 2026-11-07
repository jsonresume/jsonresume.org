import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'friendly-notebook',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Nunito Sans:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
