/**
 * What registry.jsonresume.org became (24 October 2026): what moved to
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
    title: 'An editor that saves to your gist',
    description: 'A form or JSON, with your page beside it as you type.',
    href: '/dashboard/editor',
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
    title: 'Jobs ranked for you',
    description:
      'Open roles ordered by how well they fit your resume, with what you mark remembered.',
    href: '/dashboard/jobs',
  },
];

/** Registry features not ported yet: each links to a GitHub issue asking for it. */
export const notYet: { title: string; description: string }[] = [
  {
    title: 'PDF download',
    description:
      'Meanwhile, `resume export resume.pdf` in the CLI makes one from any theme.',
  },
  {
    title: 'QR codes and RenderCV export',
    description: 'The .qr and .rendercv formats.',
  },
  {
    title: 'AI tools',
    description: 'Cover letters, resume suggestions and interview practice.',
  },
  {
    title: 'The job graph',
    description: 'Jobs and resumes as a map of similar roles.',
  },
  { title: 'Pathways', description: 'The career-planning assistant.' },
  {
    title: 'Explore',
    description: 'Browsing and comparing other people’s resumes.',
  },
  {
    title: 'API keys',
    description: 'Programmatic access to registry features.',
  },
];

export const ask = {
  title: 'Missing something you used?',
  text: 'Tell us on GitHub. We’re porting what people use, starting with what’s asked for most, and it won’t take long. Everything the registry stored is kept, so features come back with their data.',
  issue: portRequest('(a feature)'),
  issues: 'https://github.com/jsonresume/jsonresume.org/issues',
};
