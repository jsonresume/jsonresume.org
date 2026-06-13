/**
 * @jsonresume/theme-kit
 *
 * The authoring kit for JSON Resume themes. Bundles the two things every theme
 * author needs:
 *
 *  1. The SSR document helper (`renderResumeDocument`, `googleFontsLinks`),
 *     re-exported from @jsonresume/core/ssr — turn a React element into a full
 *     styled HTML document with the ServerStyleSheet boilerplate handled.
 *  2. The permanent render + section-coverage QA gate (`runThemeRenderQa`,
 *     `assertThemeRender`, `findArtifacts`, `sectionCoverage`, and the
 *     `SECTION_SENTINELS` / `BASELINE_SECTIONS` / `HANDLEBARS_THEMES`
 *     constants) — the exact gate the registry enforces across all themes.
 *
 * @module @jsonresume/theme-kit
 */
export {
  HANDLEBARS_THEMES,
  SECTION_SENTINELS,
  BASELINE_SECTIONS,
  findArtifacts,
  sectionCoverage,
  assertThemeRender,
  runThemeRenderQa,
} from './qa.js';

export { renderResumeDocument, googleFontsLinks } from './ssr.js';
