import { createTheme } from '@jsonresume/theme-primitives';
import { design } from './design.css';

export const render = createTheme({
  slug: 'easy-print',
  layout: 'single',
  defaultLanguage: 'en',
  fonts: [],
  className: design,
  css: '__JSONRESUME_INLINE_CSS__',
});
export default { render };
