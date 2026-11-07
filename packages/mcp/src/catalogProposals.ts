import type { McpToolInfo } from './catalog';

/** The catalog's proposal tools: changes suggested with propose: true. */
export const proposalTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_proposals',
    group: 'resume',
    description:
      'Changes waiting for the person to decide: each suggested with propose: true by an app or assistant, with who suggested it, its note, and what it would change in the resume as it is now.',
    writes: false,
  },
  {
    name: 'decide_proposal',
    group: 'resume',
    description:
      'Accept a proposal (saved as a new version, credited to whoever proposed it) or reject it. Only when the user has said which: never accept your own proposal unasked.',
    writes: true,
  },
];
