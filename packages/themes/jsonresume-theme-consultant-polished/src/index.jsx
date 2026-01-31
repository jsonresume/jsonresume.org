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
  <style>
    html {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      background: #fff;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
    }

    body {
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: Georgia, 'Times New Roman', serif;
      font-weight: 600;
      color: #0b1f3a;
      margin: 0;
      line-height: 1.3;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      letter-spacing: 0.01em;
    }

    h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    p {
      padding: 0;
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
    }

    a {
      color: #0b1f3a;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }

    a:hover {
      border-bottom-color: #0b1f3a;
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
