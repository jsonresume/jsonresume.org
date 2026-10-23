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
} as const;

export const external = {
  // The docs site is a separate static build on GitHub Pages.
  docs: 'https://jsonresume.org/docs',
  registry: 'https://registry.jsonresume.org',
  github: 'https://github.com/jsonresume/jsonresume.org',
  contributing:
    'https://github.com/jsonresume/jsonresume.org/blob/master/CONTRIBUTING.md',
} as const;

/** Live preview of a theme, rendered from a real resume on the registry. */
export const themePreviewUrl = (slug: string) =>
  `${external.registry}/thomasdavis?theme=${encodeURIComponent(slug)}`;

/** Screenshot of a theme, served by the app from public/img/themes. */
export const themeImageUrl = (slug: string) => `/img/themes/${slug}.webp`;

export const siteUrl = 'https://jsonresume.org';

export interface NavItem {
  label: string;
  href: string;
}

export const headerNav: NavItem[] = [
  { label: 'Getting started', href: paths.gettingStarted },
  { label: 'Schema', href: paths.schema },
  { label: 'Themes', href: paths.themes },
  { label: 'Projects', href: paths.projects },
  { label: 'Docs', href: external.docs },
  { label: 'Blog', href: paths.blog },
];

export const footerNav: NavItem[] = [
  { label: 'Getting started', href: paths.gettingStarted },
  { label: 'Schema', href: paths.schema },
  { label: 'Themes', href: paths.themes },
  { label: 'Theme development', href: paths.themeDevelopment },
  { label: 'CLI', href: paths.cli },
  { label: 'AI', href: paths.ai },
  { label: 'Job description schema', href: paths.jobDescriptionSchema },
  { label: 'Projects', href: paths.projects },
  { label: 'Team', href: paths.team },
  { label: 'Media', href: paths.media },
  { label: 'Blog', href: paths.blog },
  { label: 'GitHub', href: external.github },
];
