import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400',
      'IBM Plex Mono:wght@400;500;600',
    ],
    title,
    includeTokensCss: false,
  });
}
