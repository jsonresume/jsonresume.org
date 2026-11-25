import type { McpToolInfo } from './catalog';

/** The catalog's community tools (jsonresume.org/contributors). */
export const communityTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_contributors',
    group: 'community',
    description:
      'Everyone who has contributed to JSON Resume, as on jsonresume.org/contributors: their GitHub or npm profile and every credit (commits, pull requests, issues, comments and reviews in the jsonresume repositories, themes on npm, projects in the directory, the team), each with a link to the work. Most involved first. Filter by words (a name, login, repository or theme) and by what they did.',
    writes: false,
  },
];
