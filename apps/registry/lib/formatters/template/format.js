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

export const format = async function (resume, options) {
  const theme = options.theme ?? 'elegant';
  const themeRenderer = getTheme(theme);

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
