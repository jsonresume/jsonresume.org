/**
 * The AI tools the registry had, while they move to jsonresume.org.
 * Checked 24 October 2026: recommended jobs is here (href); the rest are
 * not ported yet (see /registry).
 */

const repo = 'https://github.com/jsonresume/jsonresume.org';

/** A new GitHub issue asking for a registry feature to be ported. */
export const portRequest = (feature: string) =>
  `${repo}/issues/new?${new URLSearchParams({
    title: `Port from the registry: ${feature}`,
    body: `I used ${feature} on registry.jsonresume.org and would like it on jsonresume.org.\n\nHow I used it:\n`,
  })}`;

export interface AiTool {
  name: string;
  description: string;
  /** Where it is on jsonresume.org, once ported. */
  href?: string;
}

export const aiTools: AiTool[] = [
  {
    name: 'Jobs for you',
    description:
      'Open roles from Hacker News "Who is hiring?", ranked by how well they fit your resume.',
    href: '/dashboard/jobs',
  },
  {
    name: 'Cover letter',
    description: 'Drafted a cover letter that fits your resume.',
  },
  {
    name: 'Resume suggestions',
    description: 'Gave specific feedback on what to improve in your resume.',
  },
  {
    name: 'Interview yourself',
    description:
      'Put your resume.json in the prompt so you could practise answering as yourself.',
  },
];

export const aiNotes = {
  lede: 'The registry’s AI tools sent your resume to a model with a fixed prompt: matching jobs, a cover letter, feedback, and an interviewer who knows your history. They are moving to jsonresume.org with the rest of the registry.',
  moving:
    'Jobs for you is here already. Tell us which of the others you use and we’ll bring those over first: each of their cards opens a GitHub issue for it.',
  openSource: 'They are open source, and so is everything replacing them.',
  source: `${repo}/tree/master/apps/registry`,
  issues: `${repo}/issues`,
};
