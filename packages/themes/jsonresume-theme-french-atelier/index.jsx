import React from 'react';
import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['Playfair Display:wght@400;700;900', 'Work Sans:wght@400;500;600'],
    title,
    includeTokensCss: false,
  });
}
