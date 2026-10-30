/**
 * Every MCP tool and prompt jsonresume.org offers, as plain data: the
 * server takes its descriptions from here (catalog.test.ts checks the two
 * match) and the /mcp page lists them. A feature isn't done until it is
 * here too.
 */
import { appTools } from './catalogApps';
import { treeTools } from './catalogTree';

export type McpGroup =
  | 'resume'
  | 'themes'
  | 'analytics'
  | 'account'
  | 'explore'
  | 'jobs'
  | 'apps';

export interface McpToolInfo {
  name: string;
  group: McpGroup;
  /** Shown to the agent: when to use the tool and what it returns. */
  description: string;
  /** Changes something (the agent's client may ask before calling it). */
  writes: boolean;
}

export interface McpPromptInfo {
  name: string;
  title: string;
  description: string;
}

export const groups: Record<McpGroup, { title: string; description: string }> =
  {
    resume: {
      title: 'Your resume',
      description:
        'Read, write and check your resume.json, wherever it lives: saves go to your gist when your page reads from it.',
    },
    themes: {
      title: 'Themes',
      description: 'Browse the themes and choose how your page looks.',
    },
    analytics: {
      title: 'Readers',
      description: 'Who reads your resume, for how long, and from where.',
    },
    account: {
      title: 'Account',
      description: 'Your username, links and where your resume comes from.',
    },
    explore: {
      title: 'Explore',
      description:
        'Find people by what their public resumes say, and choose whether yours is listed.',
    },
    jobs: {
      title: 'Jobs',
      description:
        'Hacker News “Who is hiring?” jobs: search them, rank them against your resume, and keep track of what you think.',
    },
    apps: {
      title: 'Connected apps',
      description:
        'See and disconnect the apps you’ve connected, and register OAuth apps for your own product.',
    },
  };

export const tools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_resume',
    group: 'resume',
    description:
      'Your resume as JSON Resume (the resume.json your page shows), with where it is kept (your GitHub gist or jsonresume.org) and its public URL.',
    writes: false,
  },
  {
    name: 'save_resume',
    group: 'resume',
    description:
      'Replace your whole resume with a JSON Resume object. Saved to your gist when your page reads from it. Returns any schema problems found.',
    writes: true,
  },
  {
    name: 'update_resume_section',
    group: 'resume',
    description:
      'Replace one top-level section of your resume (basics, work, volunteer, education, awards, certificates, publications, skills, languages, interests, references, projects or meta) and save it.',
    writes: true,
  },
  {
    name: 'validate_resume',
    group: 'resume',
    description:
      'Check a resume against the JSON Resume schema (yours when none is given): wrong types, dates, emails and URLs, with where each problem is.',
    writes: false,
  },
  {
    name: 'get_resume_schema',
    group: 'resume',
    description:
      'The JSON Resume schema (JSON Schema, draft-07): every section and field a resume can have.',
    writes: false,
  },
  {
    name: 'check_ats',
    group: 'resume',
    description:
      'How well applicant tracking systems (Greenhouse, Lever, Workday…) will read your resume, or one you pass: a score out of 100, each check (contact details, jobs, skills, headline, achievements, education, dates) and every issue with its fix and the field it is in.',
    writes: false,
  },
  {
    name: 'export_resume',
    group: 'resume',
    description:
      'Your resume as a file: a PDF of your page in any theme (A4 or Letter), JSON, YAML, plain text, RenderCV (for the rendercv CLI), or a QR code linking to your page. Returns its URL, and the text itself for the text formats.',
    writes: false,
  },
  {
    name: 'list_themes',
    group: 'themes',
    description:
      'The themes your page can use, with a description, tags and a live preview link for each. Filter by words or a tag.',
    writes: false,
  },
  {
    name: 'set_theme',
    group: 'themes',
    description:
      'Make a theme your page’s default (meta.theme in your resume) and save. Any theme can still be previewed with ?theme= on your page’s URL.',
    writes: true,
  },
  {
    name: 'get_resume_analytics',
    group: 'analytics',
    description:
      'Views of your resume over the last 7, 30 or 90 days: visitors, time on page, read depth, day by day, and where readers come from (sites, countries, devices, themes).',
    writes: false,
  },
  {
    name: 'get_account',
    group: 'account',
    description:
      'Your username, email, linked GitHub, where your resume comes from (gist or saved here), and your page’s links (page, PDF, timeline, JSON, YAML, text, RenderCV, QR code).',
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
      'Record what you think of a job: interested, maybe, applied or not_interested (null clears it), with an optional note. Marks shape match_jobs.',
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
  ...appTools,
  ...treeTools,
];

/** Conversations the agent can start: the registry's AI tools, as prompts. */
export const prompts: ReadonlyArray<McpPromptInfo> = [
  {
    name: 'review_resume',
    title: 'Review my resume',
    description:
      'Specific, prioritised feedback on your resume, then the changes you agree to, applied.',
  },
  {
    name: 'tailor_resume',
    title: 'Tailor my resume to a job',
    description:
      'Rework your summary, highlights and skills for one job, showing each change before saving.',
  },
  {
    name: 'cover_letter',
    title: 'Write a cover letter',
    description: 'A cover letter for a job, from your resume and the post.',
  },
  {
    name: 'interview_practice',
    title: 'Practise an interview',
    description:
      'A mock interview for a job (or your next role), one question at a time, with feedback.',
  },
  {
    name: 'job_hunt',
    title: 'Find jobs worth applying to',
    description:
      'Asks what you want, ranks open jobs against your resume, and builds a shortlist with your marks.',
  },
];
