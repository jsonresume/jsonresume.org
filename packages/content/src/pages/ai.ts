/**
 * The AI tools the registry had, and where they are on jsonresume.org.
 * Checked 25 October 2026: all are here, in Pathways and the editor.
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
    description:
      'A cover letter for any job, from your resume and the post: ask Pathways, or use “Write a cover letter” on a job’s page.',
    href: '/dashboard/pathways?ask=Write%20a%20cover%20letter%20for%20the%20job%20I%20marked%20interested%20most%20recently.',
  },
  {
    name: 'Resume suggestions',
    description:
      'Specific feedback on what to improve: the ATS check in the editor, and Pathways for the rest.',
    href: '/dashboard/editor?panel=check',
  },
  {
    name: 'Interview practice',
    description:
      'A mock interview for a job or your next role, one question at a time, with feedback, in Pathways.',
    href: '/dashboard/pathways?ask=Give%20me%20a%20mock%20interview%20for%20my%20next%20role%2C%20one%20question%20at%20a%20time.',
  },
];

export const aiNotes = {
  lede: 'The registry’s AI tools sent your resume to a model with a fixed prompt: matching jobs, a cover letter, feedback, and an interviewer who knows your history. On jsonresume.org they are one copilot, Pathways, that reads your resume and the job and can change both.',
  moving:
    'Each card opens it. Missing something the registry did? Tell us on GitHub.',
  openSource: 'They are open source, and so is everything replacing them.',
  source: `${repo}/tree/master/apps/registry`,
  issues: `${repo}/issues`,
};
