import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'portuguese-modern',
  layout: 'single',
  defaultLanguage: 'pt',
  fonts: [
    'Plus Jakarta Sans:wght@400;600;700',
    'Source Sans 3:wght@400;600;700',
  ],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
