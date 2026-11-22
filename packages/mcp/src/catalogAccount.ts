import type { McpToolInfo } from './catalog';

/** The catalog's account, analytics and Explore tools. */
export const accountTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_resume_analytics',
    group: 'analytics',
    description:
      'Views of your resume over the last 7, 30 or 90 days: visitors, time on page, read depth, day by day, and where readers come from (sites, countries, devices, themes). Also downloads as JSON, YAML, text or Word, and which browsers or tools made them.',
    writes: false,
  },
  {
    name: 'get_account',
    group: 'account',
    description:
      'Your username, email, linked GitHub, where your resume comes from (gist or saved here), and your page’s links (page, PDF, Word, timeline, JSON, YAML, text, RenderCV, QR code).',
    writes: false,
  },
  {
    name: 'set_resume_source',
    group: 'account',
    description:
      'Choose where your page reads your resume from: your GitHub gist ("gist") or the copy saved on jsonresume.org ("stored").',
    writes: true,
  },
  {
    name: 'change_username',
    group: 'account',
    description:
      'Change your username, and so your page’s URL. The old URL redirects for 90 days. Ask the user before calling this.',
    writes: true,
  },
  {
    name: 'search_resumes',
    group: 'explore',
    description:
      'Search the public resumes on jsonresume.org (Explore) by skills, role, place, name or employer: every word must match. Returns people with their headline, location, top skills and page URL, 24 a page.',
    writes: false,
  },
  {
    name: 'set_explore_listing',
    group: 'explore',
    description:
      'List your resume in Explore (true, the default) or take it out (false). Your page stays public either way.',
    writes: true,
  },
];
