import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
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
      background: #f8f9fa;
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
    title: `${resume.basics?.name || 'Resume'} - Curriculum Vitae`,
    includeTokensCss: false,
  });
}
