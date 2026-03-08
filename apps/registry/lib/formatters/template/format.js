import { getTheme } from './getTheme';

/**
 * Ensures all date fields in the resume are plain strings.
 * Some themes (e.g. macchiato) use moment.js or Handlebars helpers that
 * break when dates are Date objects instead of strings.
 */
function normalizeDates(resume) {
  const dateFields = ['startDate', 'endDate', 'date', 'releaseDate'];
  const sections = [
    'work',
    'education',
    'volunteer',
    'projects',
    'awards',
    'publications',
  ];

  const normalized = { ...resume };
  for (const section of sections) {
    if (Array.isArray(normalized[section])) {
      normalized[section] = normalized[section].map((item) => {
        const copy = { ...item };
        for (const field of dateFields) {
          if (copy[field] instanceof Date) {
            copy[field] = copy[field].toISOString().split('T')[0];
          } else if (copy[field] && typeof copy[field] === 'object') {
            copy[field] = String(copy[field]);
          }
        }
        return copy;
      });
    }
  }
  return normalized;
}

/**
 * Themes loaded via require() (e.g. macchiato, pumpkin) share a single
 * global Handlebars instance and register helpers at load time.
 * When multiple themes define the same helper name (e.g. "formatDate"),
 * the last-loaded theme's helper wins, breaking all other themes.
 *
 * This map lists themes that need fresh require() on each render so their
 * Handlebars helpers are correctly registered.
 */
const HANDLEBARS_THEMES = new Set([
  'macchiato',
  'pumpkin',
  'lucide',
  'minyma',
  'paper-plus-plus',
]);

const THEME_PACKAGES = {
  macchiato: 'jsonresume-theme-macchiato',
  pumpkin: 'jsonresume-theme-pumpkin',
  lucide: 'jsonresume-theme-lucide',
  minyma: 'jsonresume-theme-minyma',
  'paper-plus-plus': 'jsonresume-theme-paper-plus-plus',
};

/**
 * Freshly loads a Handlebars-based theme by clearing the require cache
 * for handlebars and the theme module, ensuring helpers don't collide.
 */
function freshRequireTheme(themeName) {
  const packageName = THEME_PACKAGES[themeName];
  if (!packageName) return null;

  // Clear cached handlebars so helpers are re-registered cleanly
  const hbsPath = require.resolve('handlebars');
  delete require.cache[hbsPath];

  // Clear the theme module so it re-runs its registerHelper calls
  try {
    const themePath = require.resolve(packageName);
    delete require.cache[themePath];
  } catch {
    return null;
  }

  return require(packageName);
}

export const format = async function (resume, options) {
  const theme = options.theme ?? 'elegant';

  let themeRenderer;
  if (HANDLEBARS_THEMES.has(theme)) {
    themeRenderer = freshRequireTheme(theme);
  } else {
    themeRenderer = getTheme(theme);
  }

  if (!themeRenderer) {
    throw new Error('theme-missing');
  }

  const resumeHTML = themeRenderer.render(normalizeDates(resume));

  return {
    content: resumeHTML,
    headers: [
      {
        key: 'Cache-control',
        value: 'public, max-age=90',
      },
      {
        key: 'Content-Type',
        value: 'text/html',
      },
    ],
  };
};
