import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

/**
 * Marketing Narrative Resume Theme (elegant-pink)
 * Professional storytelling theme with warm rose red tones, compelling narratives,
 * and strong visual hierarchy for marketing and communications professionals
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
      --resume-color-primary: #9f1239;
      --resume-color-secondary: #be123c;
      --resume-color-accent: #e11d48;
      --resume-color-bg: #fff1f2;
      --resume-color-card: #ffffff;
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
      background: linear-gradient(to bottom, #fff1f2 0%, #ffffff 400px);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        size: A4;
        margin: 0.5in;
      }
    }
  `;

  return renderResumeDocument(<Resume resume={resume} />, {
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
