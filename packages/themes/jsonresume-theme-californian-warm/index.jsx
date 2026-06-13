import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['Nunito:wght@400;600;700;800'],
    title,
    includeTokensCss: false,
  });
}
