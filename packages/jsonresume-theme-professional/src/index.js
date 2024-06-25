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
    font-family:
      Menlo,
      Monaco,
      Lucida Console,
      "Courier New",
      Courier,
      monospace;
    background: #fff;
    letter-spacing: -0.025rem;
  }

  body,
  figure {
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: #333;
  }

  a {
    text-decoration: none;
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
