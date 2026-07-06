import { renderResumeDocument } from '@jsonresume/core/ssr';
import Resume from './src/Resume.jsx';

/*
 * UTF-8 Safe — SSR render entry.
 *
 * renderResumeDocument (from @jsonresume/core/ssr) handles ALL the boilerplate
 * a theme used to hand-roll: it spins up the styled-components ServerStyleSheet,
 * collects styles while rendering, links the requested Google Fonts, and emits
 * the full <!DOCTYPE html> document. We just hand it the React tree + options.
 *
 *   - fonts: Google font families (or "Family:wght@400;700" specs). Loaded via
 *     the Fonts CDN in <head>. Match these to the font-family in src/Resume.jsx.
 *   - title: the <title> text.
 *   - includeTokensCss: false — this starter ships its own inline styles and
 *     does not depend on the @jsonresume/core design-token CSS. Flip to true
 *     (or drop it) if you start using the --resume-* custom properties.
 */
export function render(resume) {
  const title = (resume.basics && resume.basics.name) || 'Resume';
  return renderResumeDocument(<Resume resume={resume} />, {
    fonts: ['Inter:wght@300;400;500;600;700;800'],
    title,
    includeTokensCss: false,
  });
}
