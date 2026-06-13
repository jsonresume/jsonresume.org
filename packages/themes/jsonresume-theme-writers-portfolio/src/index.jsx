import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

/**
 * Writer's Portfolio Resume Theme
 * Literary and elegant design with transitional serif typography
 * Perfect for content writers, editors, and communications professionals
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} [options] - Rendering options
 * @returns {string} Complete HTML document
 */
export function render(resume, options = {}) {
  const {
    locale = 'en',
    dir = 'ltr',
    title = resume.basics?.name || 'Resume',
  } = options;

  const designTokens = `
    :root {
      --resume-color-primary: #2f2f2f;
      --resume-color-secondary: #5a5a5a;
      --resume-color-accent: #3a3a3a;
      --resume-color-bg: #fefdfb;
      --resume-color-card: #ffffff;
      --resume-color-border: #d4d0c8;
    }
  `;

  const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #fefdfb;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        size: A4;
        margin: 0.75in;
      }
    }
  `;

  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400'],
    head: `<style>
    ${designTokens}
  </style>`,
    headAfterStyles: `<style>
    ${globalStyles}
  </style>`,
    lang: locale,
    dir,
    title,
    includeTokensCss: false,
  });
}

export { Resume };
export default { render };
