import './layout.css.js';
import './balanced.css.js';
import './print.css.js';
import type { ThemeOptions } from './types.js';
export declare function createTheme(options: ThemeOptions): (resume: unknown) => string;
export { classes } from './base.css.js';
export { tokens, defaults } from './tokens.css.js';
export type { ThemeOptions, SectionId } from './types.js';
