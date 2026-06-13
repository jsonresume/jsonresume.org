import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'IBM Plex Mono:wght@400;500;600',
      'IBM Plex Sans:wght@400;500;600;700',
    ],
    title,
    includeTokensCss: false,
  });
}
