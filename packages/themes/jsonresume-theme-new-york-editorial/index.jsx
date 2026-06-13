import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Merriweather:ital,wght@0,400;0,700;0,900;1,400',
      'Source Sans Pro:wght@400;600',
    ],
    title,
    includeTokensCss: false,
  });
}
