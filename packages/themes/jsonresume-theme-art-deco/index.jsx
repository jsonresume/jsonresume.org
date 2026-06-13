import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Cinzel:wght@500;700',
      'Poiret One',
      'Cormorant Garamond:ital,wght@0,400;0,500;0,600;1,400',
    ],
    title,
    includeTokensCss: false,
  });
}
