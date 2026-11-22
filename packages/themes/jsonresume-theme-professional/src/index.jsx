import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './ui/Resume';

export const render = (resume) => {
  return renderResumeDocument(
    <main>
      <Resume resume={resume} />
    </main>,
    {
      head: `<style>
    @font-face {
      font-family: LatinModern;
      font-style: normal;
      font-weight: normal;
      font-display: swap;
      src: url("https://jsonresume.org/fonts/lmroman10-regular.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModern;
      font-weight: bold;
      font-display: swap;
      src: url("https://jsonresume.org/fonts/lmroman10-bold.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModern;
      font-style: italic;
      font-display: swap;
      src: url("https://jsonresume.org/fonts/lmroman10-italic.otf") format("opentype");
    }

    html {
      font-family: LatinModern, "Latin Modern Roman", Georgia, serif;
      background: #fff;
      font-size: 11px;
    }

    h2 {
      font-size: 1.65rem;
    }

    p {
      padding: 0;
      margin: 0;
    }

    p, li {
      font-size: 1.4rem;
      line-height: 1.5rem;
    }

    .secondary {
      color: #111;
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



  </style>`,
      lang: 'en',
      dir: 'ltr',
      title: `${resume.basics.name} - Resume`,
      includeTokensCss: false,
    }
  );
};

export { Resume };
