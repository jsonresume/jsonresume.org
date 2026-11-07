import type { McpToolInfo } from './catalog';

/** The catalog's variant tools: copies of the resume tailored to a job. */
export const variantTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_variants',
    group: 'resume',
    description:
      'Your resume’s variants: named copies tailored to a job or an audience, each at its own page (/@username/<slug>) with its own theme.',
    writes: false,
  },
  {
    name: 'create_variant',
    group: 'resume',
    description:
      'Make a variant: a copy of your resume (or of `resume`, if given) under a name, with its own page. Pass job_id when it is for a job from search_jobs or match_jobs. Then tailor it with save_variant; your resume itself never changes.',
    writes: true,
  },
  {
    name: 'get_variant',
    group: 'resume',
    description: 'One variant with its resume, by slug.',
    writes: false,
  },
  {
    name: 'save_variant',
    group: 'resume',
    description:
      'Replace a variant’s resume (its theme is meta.theme). Tailor it for its job: reorder and reword highlights, pick the skills that match. Keep it true: never add experience the person doesn’t have.',
    writes: true,
  },
  {
    name: 'delete_variant',
    group: 'resume',
    description: 'Delete a variant and its page. Ask the user first.',
    writes: true,
  },
];
