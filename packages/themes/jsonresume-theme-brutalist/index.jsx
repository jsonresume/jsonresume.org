import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Archivo Black',
      'Space Grotesk:wght@400;500;700',
      'Space Mono:wght@400;700',
    ],
    title,
    includeTokensCss: false,
  });
}
