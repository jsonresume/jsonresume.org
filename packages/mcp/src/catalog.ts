/**
 * Every MCP tool and prompt jsonresume.org offers, as plain data: the
 * server takes its descriptions from here (catalog.test.ts checks the two
 * match) and the /mcp page lists them. A feature isn't done until it is
 * here too.
 */
import { appTools } from './catalogApps';
import { communityTools } from './catalogCommunity';
import { directoryTools } from './catalogDirectory';
import { importTools } from './catalogImport';
import { webhookTools } from './catalogWebhooks';
import { proposalTools } from './catalogProposals';
import { variantTools } from './catalogVariants';
import { decisionTools } from './catalogDecisions';
import { jobTools } from './catalogJobs';
import { accountTools } from './catalogAccount';
import { emailTools } from './catalogEmails';
import { privacyTools } from './catalogPrivacy';
import { treeTools } from './catalogTree';
import { versionTools } from './catalogVersions';

export type McpGroup =
  | 'resume'
  | 'themes'
  | 'analytics'
  | 'account'
  | 'explore'
  | 'jobs'
  | 'apps'
  | 'community';

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
    community: {
      title: 'Community',
      description:
        'Everyone who has built JSON Resume, and what each of them did.',
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
      'Replace your whole resume with a JSON Resume object. Saved to your gist when your page reads from it. Refused if it would add schema problems (they are listed); problems the resume already had are returned but don’t block it. With propose: true it is suggested instead, for the person to accept or reject on jsonresume.org.',
    writes: true,
  },
  {
    name: 'update_resume_section',
    group: 'resume',
    description:
      'Replace one top-level section of your resume (basics, work, volunteer, education, awards, certificates, publications, skills, languages, interests, references, projects or meta) and save it. Refused, like save_resume, if it would add schema problems; propose: true suggests it instead.',
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
      'Your resume as a file: a PDF of your page in any theme (A4 or Letter; fit: true shrinks one that runs slightly over a page to fit on one), a Word document (.docx, editable), JSON, YAML, plain text, RenderCV (for the rendercv CLI), or a QR code linking to your page. Returns its URL, and the text itself for the text formats.',
    writes: false,
  },
  {
    name: 'list_themes',
    group: 'themes',
    description:
      'The themes your page can use, ranked by public-resume usage, with style, layout, colour, explicit-choice counts and previews. recommended marks the dozen that pass the ATS check and print cleanly on A4 and Letter: suggest those first. Filter by words, tag or any discovery facet. Sort by usage, explicitly chosen, name or recommended (that set first). Counts include inherited defaults unless sorting by chosen; usageAsOf identifies the snapshot.',
    writes: false,
  },
  {
    name: 'set_theme',
    group: 'themes',
    description:
      'Make a theme your page’s default (meta.theme in your resume) and save. Any theme can still be previewed with ?theme= on your page’s URL.',
    writes: true,
  },
  ...importTools,
  ...directoryTools,
  ...webhookTools,
  ...variantTools,
  ...accountTools,
  ...jobTools,
  ...decisionTools,
  ...proposalTools,
  ...privacyTools,
  ...emailTools,
  ...appTools,
  ...treeTools,
  ...versionTools,
  ...communityTools,
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
