import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Inter:wght@400;500;600;700;800',
      'Roboto Mono:wght@400;500;600;700',
    ],
    headAfterStyles: `<style>
    * {
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background:
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
      background-color: #f3f4f6;
      background-attachment: fixed;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        margin: 0.5cm;
      }
    }
  </style>`,
    lang: 'en',
    dir: 'ltr',
    title: `${resume.basics?.name || 'Resume'} - Curriculum Vitae`,
    includeTokensCss: false,
  });
}
