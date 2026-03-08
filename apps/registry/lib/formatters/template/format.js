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
 * Multiple external themes (macchiato, pumpkin, etc.) share a single
 * global Handlebars instance via require('handlebars'). They each
 * register helpers like "formatDate" at load time, and the last one
 * loaded wins — breaking all other themes that define the same helper.
 *
 * Fix: before rendering a Handlebars-based theme, evict handlebars and
 * the theme from the native Node.js require cache so the theme's
 * registerHelper() calls run fresh on a clean Handlebars instance.
 */

/* eslint-disable no-undef */
const nodeRequire =
  typeof __non_webpack_require__ !== 'undefined'
    ? __non_webpack_require__
    : require;
/* eslint-enable no-undef */

const THEME_PACKAGES = {
  macchiato: 'jsonresume-theme-macchiato',
  pumpkin: 'jsonresume-theme-pumpkin',
  lucide: 'jsonresume-theme-lucide',
  minyma: 'jsonresume-theme-minyma',
  'paper-plus-plus': 'jsonresume-theme-paper-plus-plus',
};

function freshRequireTheme(themeName) {
  const packageName = THEME_PACKAGES[themeName];
  if (!packageName) return null;

  try {
    const hbsPath = nodeRequire.resolve('handlebars');
    const themePath = nodeRequire.resolve(packageName);

    delete nodeRequire.cache[hbsPath];
    delete nodeRequire.cache[themePath];

    return nodeRequire(packageName);
  } catch {
    return null;
  }
}

export const format = async function (resume, options) {
  const theme = options.theme ?? 'elegant';

  const themeRenderer = THEME_PACKAGES[theme]
    ? freshRequireTheme(theme)
    : getTheme(theme);

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
