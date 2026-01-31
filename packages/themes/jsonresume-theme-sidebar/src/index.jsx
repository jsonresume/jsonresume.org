import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

/**
 * JSON Resume Sidebar Theme
 * Two-column layout with dark sidebar and cream main content
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} [options] - Rendering options
 * @returns {string} Complete HTML document
 */
export function render(resume, options = {}) {
  const {
    locale = 'en',
    dir = 'ltr',
    title = resume.basics?.name || 'Resume',
  } = options;

  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );

    const styles = sheet.getStyleTags();

    const designTokens = `
    :root {
      --resume-font-sans: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --resume-color-sidebar: #1e3a52;
      --resume-color-main: #f5f2ed;
      --resume-color-text: #333;
      --resume-color-accent: #1e3a52;
    }
  `;

    const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: #fff;
      }

      @page {
        size: A4;
        margin: 0;
      }
    }
  `;

    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <style>
    ${designTokens}
  </style>

  ${styles}

  <style>
    ${globalStyles}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    sheet.seal();
  }
}

export { Resume };
export default { render };
