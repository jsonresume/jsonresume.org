/**
 * Re-export of the @jsonresume/core SSR document helpers, so theme authors can
 * `import { renderResumeDocument } from '@jsonresume/theme-kit'` (or
 * '@jsonresume/theme-kit/ssr') as a single authoring entry point alongside the
 * QA gate. The implementation lives in @jsonresume/core/ssr; @jsonresume/core
 * is a peerDependency here so a theme's existing core install is reused.
 *
 * @module @jsonresume/theme-kit/ssr
 */
export { renderResumeDocument, googleFontsLinks } from '@jsonresume/core/ssr';
