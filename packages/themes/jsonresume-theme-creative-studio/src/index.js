import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './ui/Resume';

export const render = (resume) => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const styles = sheet.getStyleTags();
  return `<!DOCTYPE html><head>
  <title>${resume.basics.name} - Resume</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    html {
      font-family: 'Nunito', 'Poppins', sans-serif;
      background: #fff;
      font-size: 16px;
      color: #333;
    }

    body {
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
    }

    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ff6363;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    p {
      padding: 0;
      margin: 0;
      line-height: 1.9;
    }

    p, li {
      font-size: 1rem;
      line-height: 1.9;
    }

    a {
      color: #ff6363;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      color: #ff4545;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  </style>
  ${styles}</head><body>${html}</body></html>`;
};

export { Resume };
