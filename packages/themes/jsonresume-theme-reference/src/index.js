import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

/**
 * JSON Resume Reference Theme (JSX Edition)
 *
 * THE PERFECT SHOWCASE of @jsonresume/core with beautiful React components.
 *
 * This is the NEW architecture that demonstrates:
 * - Clean JSX syntax (no template strings)
 * - React component composition
 * - styled-components with design tokens
 * - All @jsonresume/core primitives as React components
 * - Beautiful developer experience
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} [options] - Rendering options
 * @param {string} [options.locale='en'] - Locale for date formatting (e.g., 'en-US', 'fr-FR')
 * @param {string} [options.dir='ltr'] - Text direction ('ltr' or 'rtl')
 * @param {string} [options.title] - Custom document title (defaults to resume name)
 * @param {string} [options.theme='default'] - Theme variant (default, modern, classic, minimal)
 * @param {boolean} [options.structured=false] - Return structured object instead of HTML string
 * @returns {string|Object} Complete HTML document or structured object with parts
 *
 * @example
 * // Basic usage (backwards compatible)
 * const html = render(resume);
 *
 * @example
 * // With options
 * const html = render(resume, {
 *   locale: 'fr-FR',
 *   dir: 'ltr',
 *   title: 'My Professional Resume',
 *   theme: 'modern'
 * });
 *
 * @example
 * // Get structured output
 * const { html, head, body, css } = render(resume, { structured: true });
 */
export function render(resume, options = {}) {
  const {
    locale = 'en',
    dir = 'ltr',
    title = resume.basics?.name || 'Resume',
    theme = 'default',
    structured = false,
  } = options;

  const sheet = new ServerStyleSheet();

  try {
    // Render React component to HTML string with styled-components
    const bodyHtml = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );

    // Extract CSS from styled-components
    const styledComponentsCss = sheet.getStyleTags();

    // Build structured parts
    const globalStyles = `
    /*
     * Global Styles
     * Base styles that complement @jsonresume/core design tokens
     */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #fff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: #fff;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }
  `;

    // Design tokens CSS (inlined from @jsonresume/core)
    const designTokens = `
    :root {
      --resume-font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
      --resume-font-serif: Cambria, Georgia, "Times New Roman", serif;
      --resume-font-mono: "Courier New", Courier, monospace;

      --resume-size-name: 36px;
      --resume-size-heading: 16px;
      --resume-size-subheading: 14px;
      --resume-size-body: 11px;
      --resume-size-small: 10px;

      --resume-weight-normal: 400;
      --resume-weight-medium: 500;
      --resume-weight-semibold: 600;
      --resume-weight-bold: 700;

      --resume-line-height-tight: 1.2;
      --resume-line-height-normal: 1.5;
      --resume-line-height-relaxed: 1.75;

      --resume-color-primary: #1a1a1a;
      --resume-color-secondary: #4a4a4a;
      --resume-color-accent: #2563eb;
      --resume-color-background: #ffffff;
      --resume-color-border: #e5e7eb;

      --resume-space-section: 24px;
      --resume-space-item: 16px;
      --resume-space-tight: 8px;
      --resume-space-margin: 48px;

      --resume-max-width: 660px;
      --resume-column-gap: 24px;

      --resume-radius-sm: 4px;
      --resume-radius-md: 8px;
      --resume-radius-lg: 12px;

      --resume-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --resume-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    [data-theme="modern"] {
      --resume-color-primary: #0f172a;
      --resume-color-secondary: #475569;
      --resume-color-accent: #8b5cf6;
      --resume-font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    }

    [data-theme="classic"] {
      --resume-color-primary: #000000;
      --resume-color-secondary: #333333;
      --resume-color-accent: #0066cc;
      --resume-font-sans: Georgia, "Times New Roman", serif;
    }

    [data-theme="minimal"] {
      --resume-color-primary: #18181b;
      --resume-color-secondary: #71717a;
      --resume-color-accent: #000000;
      --resume-space-section: 32px;
      --resume-space-item: 20px;
    }

    [data-theme="high-contrast"] {
      --resume-color-primary: #000000;
      --resume-color-secondary: #000000;
      --resume-color-accent: #0000ff;
      --resume-color-background: #ffffff;
      --resume-color-border: #000000;
    }

    @media print {
      :root {
        --resume-space-section: 18px;
        --resume-space-item: 12px;
      }

      .resume-section {
        page-break-inside: avoid;
      }

      .resume-item {
        break-inside: avoid;
      }

      p, li {
        widows: 3;
        orphans: 3;
      }

      .resume-description {
        hyphens: auto;
      }

      .no-print {
        display: none !important;
      }
    }

    [dir="rtl"] {
      text-align: right;
    }

    [dir="rtl"] .resume-item {
      padding-left: 0;
      padding-right: var(--resume-space-tight);
    }
  `;

    const head = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <!-- Design Tokens (inlined) -->
  <style>
    ${designTokens}
  </style>

  <!-- Styled Components CSS -->
  ${styledComponentsCss}

  <style>
    ${globalStyles}
  </style>
`;

    // Return structured object if requested
    if (structured) {
      return {
        html: `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}"${
          theme !== 'default' ? ` data-theme="${theme}"` : ''
        }>
<head>${head}</head>
<body>
  ${bodyHtml}
</body>
</html>`,
        head,
        body: bodyHtml,
        css: styledComponentsCss,
        globalStyles,
        locale,
        dir,
        theme,
      };
    }

    // Return complete HTML document (backwards compatible)
    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}"${
      theme !== 'default' ? ` data-theme="${theme}"` : ''
    }>
<head>${head}</head>
<body>
  ${bodyHtml}
</body>
</html>`;
  } finally {
    // Clean up styled-components sheet
    sheet.seal();
  }
}

export { Resume };
export default { render };
