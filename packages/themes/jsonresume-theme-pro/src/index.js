// Pro: a typeset, single-column serif résumé.
// render(resume) is pure: no input mutation, network or filesystem access.

import { section } from './components.js';
import { masthead } from './masthead.js';
import { sectionContent } from './sections.js';
import { documentLanguage, LABELS_EN, resolveSettings } from './settings.js';
import { stylesheet } from './styles.js';
import { escapeHtml, isObject } from './text.js';

const RTL = new Set(['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug', 'dv']);

/**
 * Renders the résumé and returns { html, diagnostics }. Diagnostics list
 * input the renderer tolerated but could not interpret (e.g. a malformed
 * date, shown as supplied); they never appear in the document.
 */
export function renderWithDiagnostics(input) {
  const resume = isObject(input) ? input : {};
  const diagnostics = [];
  const settings = resolveSettings(resume, diagnostics);
  const lang = documentLanguage(resume);
  const ctx = { labels: LABELS_EN, settings, diagnostics };

  const head = masthead(resume.basics, ctx);
  // Controlled labels are English; mark them when the content is not.
  const labelLang = lang.toLowerCase().startsWith('en') ? null : 'en';
  const sections = settings.sectionOrder
    .map((key) =>
      section(
        key,
        ctx.labels.sections[key],
        sectionContent(key, resume, ctx),
        labelLang
      )
    )
    .join('');

  const title = head.name
    ? `${head.name} — ${ctx.labels.resume}`
    : ctx.labels.resume;
  const dir = RTL.has(lang.split('-')[0].toLowerCase()) ? 'rtl' : 'ltr';

  const html = `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${stylesheet}</style>
</head>
<body>
<main class="pro">${head.html}${sections}</main>
</body>
</html>
`;
  return { html, diagnostics };
}

export function render(resume) {
  return renderWithDiagnostics(resume).html;
}

const theme = { render };

export default theme;
