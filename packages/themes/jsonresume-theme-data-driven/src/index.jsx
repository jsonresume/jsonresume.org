/**
 * JSON Resume Data-Driven Theme
 * Analytical design with metrics-focused layout and sky blue accent
 * Built with @jsonresume/core primitives and React SSR
 */

import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './ui/Resume.jsx';

export const render = (resume) => {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );
    const styles = sheet.getStyleTags();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.basics?.name || 'Resume'}</title>
  ${styles}
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    sheet.seal();
  }
};

export { Resume };
export default { render };
