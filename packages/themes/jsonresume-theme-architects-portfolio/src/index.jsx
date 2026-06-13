import React from 'react';
import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './Resume.jsx';

export function render(resume) {
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Red+Hat+Display:wght@300;400;500&display=swap',
    ],
    headAfterStyles: `<style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #f5f5f5;
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
    lang: 'en',
    dir: 'ltr',
    title: `${resume.basics?.name || 'Resume'} - Resume`,
    includeTokensCss: false,
  });
}
