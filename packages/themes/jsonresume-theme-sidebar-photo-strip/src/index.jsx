import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'DM Sans:wght@400;500;600;700',
      'Plus Jakarta Sans:wght@400;500;600;700',
    ],
    title: `${resume.basics?.name || 'Resume'} - Resume`,
    lang: 'en',
    dir: 'ltr',
    includeTokensCss: false,
    headAfterStyles: `<style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #f9fafb;
    }
    @media print {
      body {
        background: white;
      }
      @page {
        margin: 0.5in;
      }
    }
  </style>`,
  });
}

export default { render };
