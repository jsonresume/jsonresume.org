/**
 * What registry.jsonresume.org became (24 October 2026, updated 25 October): what moved to
 * jsonresume.org and what is still to come. Keep in step with the app.
 */
import { portRequest } from './ai';

export { portRequest };

export const intro = {
  eyebrow: 'The registry',
  title: 'The registry is now part of jsonresume.org',
  lede: 'registry.jsonresume.org has moved here. Your resume hasn’t: it’s the same gist, now at jsonresume.org/@username, and old registry links redirect to it. Nothing was lost.',
};

export const moved: { title: string; description: string; href: string }[] = [
  {
    title: 'Your resume, at /@username',
    description:
      'From your resume.json gist, in any theme, and as JSON, YAML or text.',
    href: '/@thomasdavis',
  },
  {
    title: 'All the themes',
    description: 'Every theme the registry had, with live previews.',
    href: '/themes',
  },
  {
    title: 'PDF, RenderCV and a QR code',
    description:
      'Add .pdf to your page’s address for a PDF in any theme (A4 or Letter), .rendercv for RenderCV, .qr for a code that links to it.',
    href: '/@thomasdavis.pdf',
  },
  {
    title: 'Your timeline',
    description:
      'Every role, school and project in order, at /@username/timeline.',
    href: '/@thomasdavis/timeline',
  },
  {
    title: 'An editor that saves to your gist',
    description: 'A form or JSON, with your page beside it as you type.',
    href: '/dashboard/editor',
  },
  {
    title: 'The ATS check',
    description:
      'How applicant tracking systems read your resume, scored as you type in the editor, with what to fix.',
    href: '/dashboard/editor?panel=check',
  },
  {
    title: 'Explore',
    description:
      'Search everyone’s public resume by skill, role, place and name.',
    href: '/explore',
  },
  {
    title: 'Who reads your resume',
    description: 'Views, time on page, read depth and where readers come from.',
    href: '/dashboard',
  },
  {
    title: 'Jobs from Hacker News',
    description:
      'Every “Who is hiring?” post, tidied, searchable by skill, place, level and pay.',
    href: '/jobs',
  },
  {
    title: 'Jobs ranked for you, and API keys',
    description:
      'Open roles ordered by how well they fit your resume: on the dashboard, or in the terminal with the jobs CLI and a key from Settings.',
    href: '/dashboard/jobs',
  },
  {
    title: 'Pathways',
    description:
      'A career copilot that knows your resume and today’s jobs: cover letters, tailoring and interview practice for any job, the directions open to you, and jobs to sort with a swipe.',
    href: '/dashboard/pathways',
  },
  {
    title: 'MCP for your agent',
    description:
      'ChatGPT, Claude, Cursor and other agents can manage your resume, themes and jobs.',
    href: '/mcp',
  },
];

/** Registry features not ported yet: each links to a GitHub issue asking for it. */
/** Registry features not ported yet: each links to a GitHub issue asking for it. */
export const notYet: { title: string; description: string }[] = [
  {
    title: 'The job graph',
    description:
      'Jobs and resumes as a map of similar roles. Pathways’ directions cover the same ground.',
  },
  {
    title: 'Comparing resumes',
    description: 'Similarity maps between people’s resumes.',
  },
  {
    title: 'Voice',
    description: 'Talking to Pathways out loud.',
  },
];

export const ask = {
  title: 'Missing something you used?',
  text: 'Tell us on GitHub. We’re porting what people use, starting with what’s asked for most, and it won’t take long. Everything the registry stored is kept, so features come back with their data.',
  issue: portRequest('(a feature)'),
  issues: 'https://github.com/jsonresume/jsonresume.org/issues',
};
