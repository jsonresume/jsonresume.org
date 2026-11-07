import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'systems-ledger',
  layout: 'academic',
  defaultLanguage: 'en',
  fonts: ['Space Grotesk:wght@400;600;700', 'Inter:wght@400;600;700'],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
