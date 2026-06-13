import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './ui/Resume';

export const render = (resume) => {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap',
    ],
    head: `<style>
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
  </style>`,
    title: `${resume.basics.name} - Resume`,
    includeTokensCss: false,
  });
};

export { Resume };
