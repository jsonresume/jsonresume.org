/**
 * Shared helpers for the permanent all-theme render + section-coverage gate.
 *
 * Background: across development "waves" a throwaway harness repeatedly
 * rendered every registered theme against a complete fixture to catch crashes
 * (e.g. the consultant-polished Date-shadow crash) and missing-section
 * regressions (~30 coverage gaps). This module codifies that QA so the
 * registry vitest 'unit-test' job enforces it forever.
 *
 * Used by:
 *   - themeRenderQa.test.js            (ESM/JSX themes)
 *   - themeRenderQa.handlebars.test.js (Handlebars themes, module-isolated)
 *
 * See packages/test-fixtures/complete-resume.json for the fixture (every
 * JSON Resume section is populated). See docs reference in the test files.
 */

// Handlebars-based themes share a single global Handlebars instance and
// register colliding helpers (e.g. formatDate). In production this is handled
// by format.js fresh-requiring the theme + handlebars from a clean cache; in
// the vitest worker we keep these themes in their own isolated test file and
// reset modules per render. Listed here so the ESM suite can exclude them.
export const HANDLEBARS_THEMES = [
  'macchiato',
  'pumpkin',
  'lucide',
  'minyma',
  'paper-plus-plus',
];

// Section -> sentinel strings that appear in complete-resume.json for exactly
// that section. A section counts as "covered" if ANY of its sentinels appears
// in the rendered HTML. Multiple sentinels are listed per section because
// themes render different fields (e.g. one theme prints the work company name,
// another only the position or summary) — an OR match makes coverage robust to
// those legitimate design choices. Every sentinel below is section-distinct
// within the fixture (it does not appear in any other section's content).
export const SECTION_SENTINELS = {
  basics: ['Jane Developer', 'Full Stack Software Engineer'],
  work: ['Senior Software Engineer', 'microservices architecture serving'],
  volunteer: [
    'Code for America',
    'Volunteer Software Engineer',
    'benefits eligibility screener',
  ],
  education: [
    'University of California, Berkeley',
    'Bachelor of Science',
    'Computer Science',
  ],
  awards: ['Top Contributor Award', 'top contributor to open source'],
  certificates: [
    'AWS Certified Solutions Architect',
    'Amazon Web Services',
    'Certified Kubernetes Administrator',
  ],
  publications: ['Scaling Microservices Without Losing Your Mind', 'ACM Queue'],
  skills: ['PostgreSQL'],
  languages: ['Spanish', 'Professional working proficiency', 'Native speaker'],
  interests: ['Community Building', 'Web Performance'],
  references: [
    'Sarah Johnson, Founder at StartupXYZ',
    'exceptional engineer who consistently',
    'Working with Jane was a pleasure',
  ],
  projects: ['Open Source UI Library', '5,000+ GitHub stars'],
};

// Sections every theme MUST render. This is the hard coverage baseline:
// themes legitimately omit niche sections (volunteer, certificates, etc.) by
// design, but a resume theme that drops basics/work/education/skills is broken.
export const BASELINE_SECTIONS = ['basics', 'work', 'education', 'skills'];

// Raw render artifacts that must never appear in output HTML.
const ARTIFACT_PATTERNS = [
  { label: '[object Object]', test: (h) => h.includes('[object Object]') },
  { label: 'undefined', test: (h) => /\bundefined\b/.test(h) },
  { label: 'NaN', test: (h) => /\bNaN\b/.test(h) },
];

/** Returns the list of raw artifacts found in rendered HTML (empty = clean). */
export function findArtifacts(html) {
  return ARTIFACT_PATTERNS.filter((p) => p.test(html)).map((p) => p.label);
}

/**
 * Returns { [section]: boolean } indicating which sections are present in the
 * rendered HTML. A section is covered if ANY of its sentinel strings appears.
 */
export function sectionCoverage(html) {
  const cov = {};
  for (const [section, sentinels] of Object.entries(SECTION_SENTINELS)) {
    cov[section] = sentinels.some((sentinel) => html.includes(sentinel));
  }
  return cov;
}

/**
 * Hard assertions shared by both suites: render must not throw (caller awaits
 * format), must return non-empty HTML, and must contain no raw artifacts.
 * Returns the section-coverage map for snapshotting.
 */
export function assertThemeRender(expect, themeName, html) {
  expect(
    typeof html === 'string' && html.length > 0,
    `theme "${themeName}" rendered empty HTML`
  ).toBe(true);

  const artifacts = findArtifacts(html);
  expect(
    artifacts,
    `theme "${themeName}" emitted raw artifacts: ${artifacts.join(', ')}`
  ).toEqual([]);

  const coverage = sectionCoverage(html);
  for (const section of BASELINE_SECTIONS) {
    expect(
      coverage[section],
      `theme "${themeName}" missing BASELINE section "${section}"`
    ).toBe(true);
  }
  return coverage;
}
