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
        margin: 12mm;
      }
      body > div[class] { grid-template-columns: minmax(0, .35fr) minmax(0, .65fr); gap: 6mm; padding: 0; }
      aside[class], main[class] { display: block; min-width: 0; }
      aside[class] { padding: 5mm 3mm; }
      aside[class] > *, main[class] > * { margin-bottom: 6mm; }
    }
  </style>`,
    lang: 'en',
    title: `${resume.basics?.name || 'Resume'} - Resume`,
    includeTokensCss: false,
  });
}
