/**
 * Theme registry: maps theme slugs to LAZY module loaders (#476).
 *
 * Every value is a thunk with a STATIC import specifier:
 *   slug: () => import('jsonresume-theme-x')
 *
 * Static specifiers keep webpack able to resolve and bundle each theme at
 * build time, while module EVALUATION is deferred until the thunk is invoked
 * (first render of that theme). A theme whose module throws at import time
 * therefore fails only its own renders instead of crashing this module — and
 * with it /api/[username] — for every user and every theme.
 *
 * Consumers:
 * - getTheme.js invokes + caches the loaders (with a try/catch) for rendering.
 * - Theme listings use Object.keys(THEMES) or @repo/theme-config metadata,
 *   neither of which evaluates any theme module.
 */

// Theme metadata from the shared package (no theme imports).
export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@repo/theme-config';

export const THEMES = {
  professional: () => import('@jsonresume/jsonresume-theme-professional'),
  // tailwind: () => import('jsonresume-theme-tailwind'),
  elegant: () => import('jsonresume-theme-elegant'),
  flat: () => import('jsonresume-theme-flat'),
  even: () => import('jsonresume-theme-even'),
  jacrys: () => import('jsonresume-theme-jacrys'),
  kendall: () => import('jsonresume-theme-kendall'),
  lucide: () => import('jsonresume-theme-lucide'),
  macchiato: () => import('jsonresume-theme-macchiato'),
  // mantra: REMOVED - causes build failure due to ansi-colors dependency
  minyma: () => import('jsonresume-theme-minyma'),
  'paper-plus-plus': () => import('jsonresume-theme-paper-plus-plus'),
  pumpkin: () => import('jsonresume-theme-pumpkin'),
  rickosborne: () => import('jsonresume-theme-rickosborne'),
  stackoverflow: () => import('@jsonresume/theme-stackoverflow'),
  'tan-responsive': () => import('jsonresume-theme-tan-responsive'),
  reference: () => import('jsonresume-theme-reference'),
  sidebar: () => import('jsonresume-theme-sidebar'),
  'modern-classic': () => import('jsonresume-theme-modern-classic'),
  'executive-slate': () => import('jsonresume-theme-executive-slate'),
  'product-manager-canvas': () =>
    import('jsonresume-theme-product-manager-canvas'),
  'government-standard': () => import('jsonresume-theme-government-standard'),
  'developer-mono': () => import('jsonresume-theme-developer-mono'),
  'minimalist-grid': () => import('jsonresume-theme-minimalist-grid'),
  'creative-studio': () =>
    import('@jsonresume/jsonresume-theme-creative-studio'),
  'data-driven': () => import('jsonresume-theme-data-driven'),
  'consultant-polished': () =>
    import('@jsonresume/jsonresume-theme-consultant-polished'),
  'university-first': () => import('jsonresume-theme-university-first'),
  'academic-cv-lite': () => import('jsonresume-theme-academic-cv-lite'),
  'sales-hunter': () => import('jsonresume-theme-sales-hunter'),
  'marketing-narrative': () => import('jsonresume-theme-marketing-narrative'),
  'operations-precision': () => import('jsonresume-theme-operations-precision'),
  'writers-portfolio': () => import('jsonresume-theme-writers-portfolio'),
  // 'tokyo-modernist': DISABLED - styled-components resolution issue
  'nordic-minimal': () => import('jsonresume-theme-nordic-minimal'),
  'graph-paper-grid': () => import('jsonresume-theme-graph-paper-grid'),
  'monochrome-noir': () => import('jsonresume-theme-monochrome-noir'),
  'two-column-modernist': () => import('jsonresume-theme-two-column-modernist'),
  'sidebar-photo-strip': () => import('jsonresume-theme-sidebar-photo-strip'),
  'architects-portfolio': () => import('jsonresume-theme-architects-portfolio'),
  'diagonal-accent-bar': () => import('jsonresume-theme-diagonal-accent-bar'),
  'asymmetric-timeline': () => import('jsonresume-theme-asymmetric-timeline'),
  'mid-century-resume': () => import('jsonresume-theme-mid-century-resume'),
  'bold-header-statement': () =>
    import('jsonresume-theme-bold-header-statement'),
  'typewriter-modern': () => import('jsonresume-theme-typewriter-modern'),
  'new-york-editorial': () => import('jsonresume-theme-new-york-editorial'),
  'berlin-grid': () => import('jsonresume-theme-berlin-grid'),
  'californian-warm': () => import('jsonresume-theme-californian-warm'),
  'london-bureau': () => import('jsonresume-theme-london-bureau'),
  'pacific-horizon': () => import('jsonresume-theme-pacific-horizon'),
  'french-atelier': () => import('jsonresume-theme-french-atelier'),
  'urban-techno': () => import('jsonresume-theme-urban-techno'),
  'coastal-creative': () => import('jsonresume-theme-coastal-creative'),
  'investor-brief': () => import('jsonresume-theme-investor-brief'),
  claude: () => import('jsonresume-theme-claude'),
  colophon: () => import('jsonresume-theme-colophon'),
  'community-garden': () => import('jsonresume-theme-community-garden'),
  'creative-confidence': () => import('jsonresume-theme-creative-confidence'),
  'art-school-modern': () => import('jsonresume-theme-art-school-modern'),
  'field-researcher': () => import('jsonresume-theme-field-researcher'),
  'clinical-precision': () => import('jsonresume-theme-clinical-precision'),
  'industrial-engineer': () => import('jsonresume-theme-industrial-engineer'),
  brutalist: () => import('jsonresume-theme-brutalist'),
  'art-deco': () => import('jsonresume-theme-art-deco'),
};
