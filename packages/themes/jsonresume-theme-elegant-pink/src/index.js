import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

/**
 * Elegant Pink Resume Theme
 * Super girly theme with soft pinks, elegant typography, and floral accents
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
      --resume-color-primary: #d63384;
      --resume-color-secondary: #9d5b7a;
      --resume-color-accent: #ff9fc7;
      --resume-color-bg: #fff5f7;
      --resume-color-card: #ffffff;
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
      background: linear-gradient(135deg, #fff5f7 0%, #ffe4e8 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        size: A4;
        margin: 0.5in;
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
