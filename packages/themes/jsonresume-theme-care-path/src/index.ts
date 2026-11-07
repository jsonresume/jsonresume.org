import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'care-path',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Figtree:wght@400;600;700'],
  sectionOrder: ['work', 'certificates', 'volunteer'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
