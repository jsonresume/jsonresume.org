import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './ui/Resume';

export const render = (resume) => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const styles = sheet.getStyleTags();
  return `<!DOCTYPE html><head>
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

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    text-wrap: pretty;
  }

  .print {
    display: none !important;
  }

  @media print {
    .no-print {
      display: none !important;
    }

    .print {
      display: block !important;
    }

    astro-dev-toolbar {
      display: none !important;
    }

    article {
      break-inside: avoid;
    }
  }
  /* Hero */
    .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 32px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    color: #444;
    font-weight: 500;
    font-size: 1.1rem;
    text-wrap: balance;
  }

  img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 128px;
    border-radius: 16px;
  }

  span {
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    letter-spacing: -0.05rem;
  }

  footer {
    color: #555;
    font-size: 0.65rem;
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  footer a {
    color: #777;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #eee;
    padding: 4px;
    height: 32px;
    width: 32px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  footer a:hover {
    background: #eee;
    border: 1px solid #ddd;
  }

  @media (width <= 700px) {
    .container {
      flex-direction: column-reverse;
    }

    .info {
      justify-content: center;
      align-items: center;
      padding-right: 0;
      text-align: center;
    }

    figure {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    h2 {
      text-wrap: balance;
    }

    figure {
      margin: 0 auto;
    }
  }

  /* Experience */
.experience {
  ul {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  article h3 {
    font-weight: 500;
    color: #111;
  }

  article a {
    color: #111;
  }

  article a:hover {
    text-decoration: underline;
  }

  article h4 {
    color: #222;
    font-weight: 400;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  time {
    color: #555;
    font-size: 0.85rem;
    min-width: 102px;
  }

  @media (width <= 700px) {
    time {
      text-align: right;
    }
  }
}
  /* Projects */
.projects {
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-inline: -16px;
  }

  article {
    border-radius: 8px;
    border: 1px solid #f2f2f2;
    gap: 16px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: 100%;
  }

  article header {
    flex: 1;
  }

  article h3 {
    margin-bottom: 4px;
  }

  article a {
    color: #111;
  }

  article a:hover {
    text-decoration: underline;
  }

  article p {
    font-size: 0.75rem;
    line-height: 1.2rem;
    margin-bottom: 4px;
  }

  article h3 span {
    color: rgb(0, 188, 47);
    animation-name: flicker;
    animation-duration: 3s;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 0.6rem;
  }

  footer span {
    border-radius: 6px;
    background: #eee;
    color: #444;
    font-size: 0.6rem;
    font-weight: 500;
    padding: 0.2rem 0.6rem;
  }

  .github-code-link {
    margin-left: 5px;
  }

  @keyframes flicker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 1;
    }
  }

  @media (width <= 700px) {
    ul {
      margin-inline: 0px;
    }

    article {
      border: none;
      box-shadow: 0 1px 1px #f2f2f2;
      padding: 0 0 16px 0;
    }
  }

  @media print {
    article h3 span {
      animation-name: none;
    }
  }
}
  </style>
  ${styles}</head><body>${html}</body></html>`;
};

export { Resume };
