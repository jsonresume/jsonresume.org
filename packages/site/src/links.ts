/** Where things live on jsonresume.org and beyond. */
export const paths = {
  home: '/',
  gettingStarted: '/getting-started',
  schema: '/schema',
  themes: '/themes',
  projects: '/projects',
  team: '/team',
  cli: '/cli',
  ai: '/ai',
  themeDevelopment: '/theme-development',
  jobDescriptionSchema: '/job-description-schema',
  media: '/media',
  blog: '/blog',
  post: (slug: string) => `/blog/${slug}`,
  signIn: '/signin',
  signUp: '/signup',
  chooseUsername: '/signup/username',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  oauthAuthorize: '/oauth/authorize',
  mcp: '/mcp',
  developers: '/developers',
  privacy: '/privacy',
  terms: '/terms',
  registry: '/registry',
  jobs: '/jobs',
  job: (id: number) => `/jobs/${id}`,
  dashboard: '/dashboard',
  dashboardJobs: '/dashboard/jobs',
  /** Pathways, putting `ask` to the copilot on arrival. */
  pathways: (ask?: string) =>
    ask
      ? `/dashboard/pathways?ask=${encodeURIComponent(ask)}`
      : '/dashboard/pathways',
  explore: '/explore',
  timeline: (username: string) => `/@${username}/timeline`,
  dashboardResume: '/dashboard/resume',
  dashboardEditor: '/dashboard/editor',
  dashboardSettings: '/dashboard/settings',
} as const;

export const external = {
  // The docs site is a separate static build on GitHub Pages.
  docs: 'https://jsonresume.org/docs',
  github: 'https://github.com/jsonresume/jsonresume.org',
  discord: 'https://discord.gg/GTZtn8pTXC',
  contributing:
    'https://github.com/jsonresume/jsonresume.org/blob/master/CONTRIBUTING.md',
} as const;

/** A resume's page on this site; `extension` for pdf, docx, json and the rest. */
export const resumeUrl = (username: string, extension?: string) =>
  extension ? `/@${username}.${extension}` : `/@${username}`;

/** Live preview of a theme, rendered from a real resume hosted here. */
export const themePreviewUrl = (slug: string) =>
  `${resumeUrl('thomasdavis')}?theme=${encodeURIComponent(slug)}`;

/** The theme open in the gallery's preview, where the rest are a click away. */
export const themeInGalleryUrl = (slug: string) =>
  `${paths.themes}?theme=${encodeURIComponent(slug)}`;

/** Bump the revision when previews change: static images are cached for a day. */
export const themeImageUrl = (slug: string) =>
  `/img/themes/${slug}.webp?v=20261107-print`;

export const siteUrl = 'https://jsonresume.org';

export interface NavItem {
  label: string;
  href: string;
}

export const headerNav: NavItem[] = [
  { label: 'Getting started', href: paths.gettingStarted },
  { label: 'Schema', href: paths.schema },
  { label: 'Themes', href: paths.themes },
  { label: 'Explore', href: paths.explore },
  { label: 'Jobs', href: paths.jobs },
  { label: 'MCP', href: paths.mcp },
  { label: 'Docs', href: external.docs },
  { label: 'Blog', href: paths.blog },
];

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const footerGroups: NavGroup[] = [
  {
    title: 'Resume',
    items: [
      { label: 'Getting started', href: paths.gettingStarted },
      { label: 'Schema', href: paths.schema },
      { label: 'Themes', href: paths.themes },
      { label: 'Explore resumes', href: paths.explore },
      { label: 'Jobs', href: paths.jobs },
    ],
  },
  {
    title: 'Build',
    items: [
      { label: 'CLI', href: paths.cli },
      { label: 'Theme development', href: paths.themeDevelopment },
      { label: 'Job description schema', href: paths.jobDescriptionSchema },
      { label: 'MCP for agents', href: paths.mcp },
      { label: 'AI', href: paths.ai },
      { label: 'Sign in with JSON Resume', href: paths.developers },
    ],
  },
  {
    title: 'Project',
    items: [
      { label: 'Blog', href: paths.blog },
      { label: 'Projects', href: paths.projects },
      { label: 'Team', href: paths.team },
      { label: 'Media', href: paths.media },
      { label: 'GitHub', href: external.github },
      { label: 'Discord', href: external.discord },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Privacy', href: paths.privacy },
  { label: 'Terms', href: paths.terms },
];

/** Every footer link, in order. */
export const footerNav: NavItem[] = [
  ...footerGroups.flatMap((g) => g.items),
  ...legalNav,
];
