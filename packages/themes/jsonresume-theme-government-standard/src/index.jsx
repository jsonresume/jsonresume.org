import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    headAfterStyles: `<style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Times New Roman', Georgia, serif;
    }
    @media print {
      body {
        background: white;
      }
      @page {
        margin: 1in;
      }
    }
  </style>`,
    lang: 'en',
    dir: 'ltr',
    title: `${resume.basics?.name || 'Resume'} - Resume`,
    includeTokensCss: false,
  });
}
