import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'sunbeam-cv',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Bricolage Grotesque:wght@400;600;700', 'Figtree:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
