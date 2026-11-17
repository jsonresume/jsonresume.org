import type { McpToolInfo } from './catalog';

/** The catalog's job tools: the board, matches, marks and directions. */
export const jobTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'search_jobs',
    group: 'jobs',
    description:
      'Search the open jobs from Hacker News “Who is hiring?” (the last two monthly threads) by words, where (remote, anywhere, onsite), level and least yearly pay in USD.',
    writes: false,
  },
  {
    name: 'match_jobs',
    group: 'jobs',
    description:
      'Open jobs ranked by how well they fit your resume: a 0 to 100 fit judged by AI against each post, with the post’s best role for you and why. Jobs you can’t take from where you live (basics.location.countryCode) are left out; low pay or a role below your level caps the fit; your marks nudge the order. Same filters as search_jobs.',
    writes: false,
  },
  {
    name: 'get_job',
    group: 'jobs',
    description:
      'One job in full: the role, company, pay, where, skills, responsibilities, how to apply, the original post, and your mark.',
    writes: false,
  },
  {
    name: 'mark_job',
    group: 'jobs',
    description:
      'Record what you think of a job: interested, maybe, applied or not_interested (null clears it), with an optional note and, for not_interested, the reason (pay, place, sector, stack, level, company, role, other). Marks shape match_jobs and decide_jobs, and teach decide_jobs’s suggestions.',
    writes: true,
  },
  {
    name: 'get_career_directions',
    group: 'jobs',
    description:
      'The directions your career could take now: the open jobs that fit your resume, grouped by kind of role (founding engineer, engineering leadership, AI…), each with its best and typical fit, median pay, how often it is remote, the skills it asks for, and those your resume doesn’t show yet.',
    writes: false,
  },
  {
    name: 'list_marked_jobs',
    group: 'jobs',
    description:
      'The jobs you have marked, newest first, optionally only one mark (e.g. applied), with your notes.',
    writes: false,
  },
];
