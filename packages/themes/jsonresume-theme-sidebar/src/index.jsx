import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

/**
 * JSON Resume Sidebar Theme
 * Two-column layout with dark sidebar and cream main content
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
      --resume-font-sans: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --resume-color-sidebar: #1e3a52;
      --resume-color-main: #f5f2ed;
      --resume-color-text: #333;
      --resume-color-accent: #1e3a52;
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: #fff;
      }

      @page {
        size: auto;
        margin: 12mm;
      }
      body > div[class] {
        grid-template-columns: minmax(0, 0.36fr) minmax(0, 0.64fr);
      }
      aside[class] { padding: 20px 16px; min-width: 0; }
      main[class] { padding: 20px 22px; min-width: 0; }
      h1[class] { font-size: 28pt; }
      h1, h2, h3, h4 { break-inside: avoid; break-after: avoid; }
      h1, h2, h3, p, li, a { overflow-wrap: anywhere; }
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
