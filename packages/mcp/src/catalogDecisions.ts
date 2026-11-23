import type { McpToolInfo } from './catalog';

/** The catalog's decision tools: which jobs to go for, and what the person wants. */
export const decisionTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'decide_jobs',
    group: 'jobs',
    description:
      'Which open jobs to go for. Each job gets a verdict: apply (a good chance at a job you’d want), stretch (one you’d want, with gaps), skip, or ruled_out (a dealbreaker from your preferences, named). With chance (how likely you’d get it: the post’s required skills your resume shows, the AI’s fit, the level), appeal (how much you’d want it: pay, workplace, industry, stack, direction, what your marks taught), the reasons, the required skills you show and miss, and the company’s industries and stage. Best first. Also suggestions learned from your marks. Set preferences first with set_job_preferences for decisions that know what you want.',
    writes: false,
  },
  {
    name: 'get_job_preferences',
    group: 'jobs',
    description:
      'What you want from your next job: workplaces, pay floor and target (yearly USD), kinds of employment and levels you’d take, industries to avoid and to favour, company stages, skills you want to use or avoid, where you want to go (in words), your top priorities and whether you need a visa.',
    writes: false,
  },
  {
    name: 'set_job_preferences',
    group: 'jobs',
    description:
      'Change what you want from your next job. Only the fields given change; lists replace the old list. Dealbreakers (workplaces, pay floor, employment, levels, avoided industries and skills, visa) rule jobs out of decide_jobs; the rest weigh how much you’d want each job. An empty direction falls back to the resume’s objective. weeklyEmail turns on (or off) a Monday email of new apply and stretch jobs. Ask the person rather than guessing, and never turn the email on without them asking.',
    writes: true,
  },
];
