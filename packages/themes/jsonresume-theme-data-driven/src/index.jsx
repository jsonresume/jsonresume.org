/**
 * JSON Resume Data-Driven Theme
 * Analytical design with metrics-focused layout and sky blue accent
 * Built with @jsonresume/core primitives and React SSR
 */

import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './ui/Resume.jsx';

export const render = (resume) =>
  renderResumeDocument(<Resume resume={resume} />, {
    title: resume.basics?.name || 'Resume',
    includeTokensCss: false,
  });

export { Resume };
export default { render };
