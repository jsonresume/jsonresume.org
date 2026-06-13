/**
 * Shared helpers for the permanent all-theme render + section-coverage gate.
 *
 * The implementation now lives in @jsonresume/theme-kit (extracted in the W2
 * ecosystem work, #421) so theme authors get the SAME gate the registry
 * enforces. This module is a thin re-export shim: the existing registry suites
 *
 *   - themeRenderQa.test.js            (ESM/JSX themes)
 *   - themeRenderQa.handlebars.test.js (Handlebars themes, module-isolated)
 *
 * import the helpers/constants from this path unchanged. The assertions,
 * regexes, sentinels, and baseline are defined once in @jsonresume/theme-kit
 * and identical here.
 *
 * See packages/theme-kit/src/qa.js for the source and
 * @jsonresume/sample-data complete-resume.json for the fixture.
 */
export {
  HANDLEBARS_THEMES,
  SECTION_SENTINELS,
  BASELINE_SECTIONS,
  findArtifacts,
  sectionCoverage,
  assertThemeRender,
} from '@jsonresume/theme-kit/qa';
