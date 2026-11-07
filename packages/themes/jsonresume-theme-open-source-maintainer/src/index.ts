import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'open-source-maintainer',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: ['Space Grotesk:wght@400;600;700', 'Inter:wght@400;600;700'],
  sectionOrder: ['projects', 'work'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
