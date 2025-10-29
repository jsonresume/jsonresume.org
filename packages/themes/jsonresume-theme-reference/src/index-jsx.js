import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

/**
 * JSON Resume Reference Theme (JSX Edition)
 *
 * THE PERFECT SHOWCASE of @resume/core with beautiful React components.
 *
 * This is the NEW architecture that demonstrates:
 * - Clean JSX syntax (no template strings)
 * - React component composition
 * - styled-components with design tokens
 * - All @resume/core primitives as React components
 * - Beautiful developer experience
 *
 * @param {Object} resume - JSON Resume object
 * @returns {string} Complete HTML document with embedded styles
 */
export function render(resume) {
  const sheet = new ServerStyleSheet();

  try {
    // Render React component to HTML string with styled-components
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );

    // Extract CSS from styled-components
    const styles = sheet.getStyleTags();

    // Return complete HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.basics?.name || 'Resume'}</title>

  <!-- Design Tokens from @resume/core -->
  <link rel="stylesheet" href="https://unpkg.com/@resume/core@0.1.0/src/styles/tokens.css">

  <!-- Styled Components CSS -->
  ${styles}

  <style>
    /*
     * Global Styles
     * Base styles that complement @resume/core design tokens
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
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    // Clean up styled-components sheet
    sheet.seal();
  }
}

export { Resume };
export default { render };
