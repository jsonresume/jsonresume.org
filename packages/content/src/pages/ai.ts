/**
 * The AI tools the registry had, while they move to jsonresume.org.
 * Checked 24 October 2026: none is ported yet (see /registry).
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
}

export const aiTools: AiTool[] = [
  {
    name: 'Recommended jobs',
    description:
      'Matched your resume against recent Hacker News "Who is hiring?" posts.',
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
    'None of them is ported yet. Tell us which you use and we’ll bring those over first: each card opens a GitHub issue for it.',
  openSource: 'They are open source, and so is everything replacing them.',
  source: `${repo}/tree/master/apps/registry`,
  issues: `${repo}/issues`,
};
