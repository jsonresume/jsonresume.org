import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './ui/Resume';

export const render = (resume) => {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
    ],
    head: `<style>
    html {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fafbfc;
      font-size: 16px;
      color: #1a1d23;
    }

    body {
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Outfit', sans-serif;
      margin: 0;
      padding: 0;
    }

    h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1d23;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.375rem;
      font-weight: 700;
      color: #1a1d23;
    }

    p {
      padding: 0;
      margin: 0;
      line-height: 1.7;
    }

    p, li {
      font-size: 1rem;
      line-height: 1.7;
    }

    a {
      color: #c71585;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      color: #a0115f;
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

    @media print {
      html {
        background: white;
      }
    }
  </style>`,
    lang: 'en',
    dir: 'ltr',
    title: `${resume.basics.name} - Resume`,
    includeTokensCss: false,
  });
};

export { Resume };
