import type { UserPath } from './types';

export interface AiTool {
  name: string;
  description: string;
  /** Who can use it without signing in to the registry. */
  access: 'public' | 'sign-in';
  path: UserPath;
}

const registry = 'https://registry.jsonresume.org';

/** Registry tools that send your hosted resume to a model with a fixed prompt. */
export const aiTools: AiTool[] = [
  {
    name: 'Recommended jobs',
    description:
      'Matches your resume against recent Hacker News "Who is hiring?" posts.',
    access: 'public',
    path: (u) => `${registry}/${u}/jobs`,
  },
  {
    name: 'Cover letter',
    description: 'Drafts a cover letter that fits your resume.',
    access: 'sign-in',
    path: (u) => `${registry}/${u}/letter`,
  },
  {
    name: 'Resume suggestions',
    description: 'Specific feedback on what to improve in your resume.',
    access: 'sign-in',
    path: (u) => `${registry}/${u}/suggestions`,
  },
  {
    name: 'Interview yourself',
    description:
      'Puts your resume.json in the prompt so you can practise answering as yourself.',
    access: 'sign-in',
    path: (u) => `${registry}/${u}/interview`,
  },
];

export const aiNotes = {
  requirement:
    'The tools read the resume you host on the registry, so they need a [Gist named resume.json](/getting-started#gist).',
  openSource:
    'They are open source. The hosted versions share one API account, so usage limits apply, and each run generates a new response.',
  signIn: 'https://registry.jsonresume.org/login',
  source:
    'https://github.com/jsonresume/jsonresume.org/tree/master/apps/registry',
};
