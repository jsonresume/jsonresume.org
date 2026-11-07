import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['IBM Plex Sans:wght@400;500;600;700'],
    title,
    headAfterStyles:
      '<style>@media print{h1,h2,h3,h4{break-inside:avoid;break-after:avoid}}</style>',
    includeTokensCss: false,
  });
}
