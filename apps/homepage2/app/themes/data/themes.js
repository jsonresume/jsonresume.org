// Import from the single source of truth - shared theme-config package
import { THEME_METADATA } from '@repo/theme-config';

const REGISTRY_URL = 'https://registry.jsonresume.org';

// Themes that have metadata but are NOT registered in the registry's THEMES map
// (apps/registry/lib/formatters/template/themeConfig.js). They cannot be
// previewed live, so we hide their cards to avoid broken preview links.
// Keep this in sync with the commented-out entries in themeConfig.js.
const UNREGISTERED_THEMES = new Set([
  // (empty — every theme with metadata is currently registered in themeConfig.js)
]);

// Legacy theme metadata (for themes with specific GitHub author info)
const legacyAuthors = {
  elegant: {
    github: 'mudassir0909',
    author: 'Mudassir',
    link: 'https://github.com/mudassir0909',
  },
  professional: {
    github: 'thomasdavis',
    author: 'Thomas Davis',
    link: 'https://registry.jsonresume.org/thomasdavis',
  },
  kendall: {
    github: 'LinuxBozo',
    author: 'M. Adam Kendall',
    link: 'https://registry.jsonresume.org/linuxbozo',
  },
  macchiato: {
    github: 'biosan',
    author: 'Alessandro Biondi',
    link: 'https://registry.jsonresume.org/biosan',
  },
  relaxed: {
    github: 'ObserverOfTime',
    author: 'ObserverOfTime',
    link: 'https://github.com/ObserverOfTime',
  },
  stackoverflow: {
    github: 'phoinixi',
    author: 'Francesco Esposito',
    link: 'https://github.com/phoinixi',
  },
  flat: {
    github: 'erming',
    author: 'Mattias Erming',
    link: 'https://github.com/erming',
  },
};

// Convert THEME_METADATA to homepage format.
// Derived from the shared metadata so the gallery stays in sync automatically:
// any newly registered theme that has metadata + a screenshot shows up here.
export const themes = Object.entries(THEME_METADATA)
  .filter(([slug]) => !UNREGISTERED_THEMES.has(slug))
  .map(([slug, metadata]) => {
    const legacy = legacyAuthors[slug];

    return {
      name: metadata.name,
      slug,
      author: legacy?.author || metadata.author,
      github: legacy?.github || '',
      link: legacy?.link || `${REGISTRY_URL}/thomasdavis?theme=${slug}`,
      description: metadata.description,
      tags: metadata.tags,
      screenshot: `/img/themes/${slug}.png`,
    };
  });
