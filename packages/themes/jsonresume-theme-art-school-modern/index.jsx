import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: [
      'Archivo Black',
      'Archivo:wght@400;500;600;700;800',
      'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500',
    ],
    title,
    includeTokensCss: false,
  });
}

export default { render };
