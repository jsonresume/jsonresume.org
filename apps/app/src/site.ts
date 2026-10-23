/**
 * Links to pages that still live on the current site. They move into this
 * app one at a time; until then the new pages link to the live ones.
 */
export const links = {
  gettingStarted: 'https://jsonresume.org/getting-started',
  schema: 'https://jsonresume.org/schema',
  themes: 'https://jsonresume.org/themes',
  docs: 'https://jsonresume.org/docs',
  blog: 'https://jsonresume.org/blog',
  team: 'https://jsonresume.org/team',
  cli: 'https://jsonresume.org/cli',
  registry: 'https://registry.jsonresume.org',
  github: 'https://github.com/jsonresume/jsonresume.org',
  contributing:
    'https://github.com/jsonresume/jsonresume.org/blob/master/CONTRIBUTING.md',
} as const;

/** Live preview of a theme, rendered from a real resume on the registry. */
export const themePreviewUrl = (slug: string) =>
  `${links.registry}/thomasdavis?theme=${encodeURIComponent(slug)}`;

export const siteUrl = 'https://jsonresume.org';
