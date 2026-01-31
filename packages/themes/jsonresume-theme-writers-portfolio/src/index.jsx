import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

/**
 * Writer's Portfolio Resume Theme
 * Literary and elegant design with transitional serif typography
 * Perfect for content writers, editors, and communications professionals
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
      --resume-color-primary: #2f2f2f;
      --resume-color-secondary: #5a5a5a;
      --resume-color-accent: #3a3a3a;
      --resume-color-bg: #fefdfb;
      --resume-color-card: #ffffff;
      --resume-color-border: #d4d0c8;
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
      background: #fefdfb;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        size: A4;
        margin: 0.75in;
      }
    }
  `;

    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet">

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
