import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['Space Grotesk:wght@400;500;600;700'],
    headAfterStyles: `<style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Space Grotesk', 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #ffffff;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      @page {
        margin: 0.5cm;
      }
    }
  </style>`,
    lang: 'en',
    title: `${resume.basics?.name || 'Resume'} - Resume`,
    includeTokensCss: false,
  });
}
