import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const styles = sheet.getStyleTags();
  const title = (resume.basics && resume.basics.name) || 'Resume';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&display=swap" rel="stylesheet">
  ${styles}
</head>
<body>${html}</body>
</html>`;
}

export default { render };
