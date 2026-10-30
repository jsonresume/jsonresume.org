import type { McpToolInfo } from './catalog';

/** The catalog's career tree tool (Pathways → Tree). */
export const treeTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_career_tree',
    group: 'jobs',
    description:
      'Your career as a tree of what rests on what (Pathways → Tree): the skills on your resume that hold up the most of your best-fitting jobs, the missing skills those jobs ask for most (what would open the most doors), and each kind of role with the experience it rests on and its jobs.',
    writes: false,
  },
];
