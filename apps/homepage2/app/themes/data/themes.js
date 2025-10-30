// Import from the single source of truth - registry themeConfig.js
import { THEME_METADATA } from '../../../registry/lib/formatters/template/themeConfig.js';

const REGISTRY_URL = 'https://registry.jsonresume.org';

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

// Convert THEME_METADATA to homepage format
export const themes = Object.entries(THEME_METADATA).map(([slug, metadata]) => {
  const legacy = legacyAuthors[slug];

  return {
    name: metadata.name,
    slug,
    author: legacy?.author || metadata.author,
    github: legacy?.github || '',
    link: legacy?.link || `${REGISTRY_URL}/thomasdavis?theme=${slug}`,
    description: metadata.description,
    tags: metadata.tags,
    screenshot: `/theme-screenshots/${slug}.png`,
  };
});
