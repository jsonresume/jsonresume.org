import type { McpToolInfo } from './catalog';

/** The catalog's career tools (Pathways → Tree and its plans). */
export const treeTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_career_tree',
    group: 'jobs',
    description:
      'Your career graph (Pathways → Tree) in words: your strengths; the best-fitting jobs you show every required skill for, and those one skill away (with the skill); the missing skills that would open the most jobs; where people in your current role went next (destination ids for create_pathway_plan); and your plan’s progress.',
    writes: false,
  },
  {
    name: 'get_career_moves',
    group: 'jobs',
    description:
      'Where people in your current role went next, learned from thousands of public resumes: each next role and level, the share of people who made the move, and the median years it took.',
    writes: false,
  },
  {
    name: 'list_pathway_plans',
    group: 'jobs',
    description:
      'Your plans to get somewhere, newest first, with their steps and which are done.',
    writes: false,
  },
  {
    name: 'create_pathway_plan',
    group: 'jobs',
    description:
      'Make a plan to reach a destination: a destination id from get_career_tree, or a role in your own words ("Head of AI platform"). Steps are written for you from your resume, the skills you don’t show yet and the jobs open now; they appear on your tree.',
    writes: true,
  },
  {
    name: 'set_plan_step',
    group: 'jobs',
    description: 'Mark a plan step done, or not done.',
    writes: true,
  },
  {
    name: 'delete_pathway_plan',
    group: 'jobs',
    description:
      'Delete one of your plans. Ask the user first; it can’t be undone.',
    writes: true,
  },
];
