import themesData from '../../../public/themes.json';

// Original existing themes
const existingThemes = [
  {
    name: 'Elegant',
    slug: 'elegant',
    github: 'mudassir0909',
    author: 'Mudassir',
    link: 'https://github.com/mudassir0909',
  },
  {
    name: 'Professional',
    slug: 'professional',
    github: 'thomasdavis',
    author: 'Thomas Davis',
    link: 'https://registry.jsonresume.org/thomasdavis',
  },
  {
    name: 'Kendall',
    slug: 'kendall',
    github: 'LinuxBozo',
    author: 'M. Adam Kendall',
    link: 'https://registry.jsonresume.org/linuxbozo',
  },
  {
    name: 'Macchiato',
    slug: 'macchiato',
    github: 'biosan',
    author: 'Alessandro Biondi',
    link: 'https://registry.jsonresume.org/biosan',
  },
  {
    name: 'Relaxed',
    slug: 'relaxed',
    github: 'ObserverOfTime',
    author: 'ObserverOfTime',
    link: 'https://github.com/ObserverOfTime',
  },
  {
    name: 'Stack Overflow',
    slug: 'stackoverflow',
    github: 'phoinixi',
    author: 'Francesco Esposito',
    link: 'https://github.com/phoinixi',
  },
  {
    name: 'Rickosborne',
    slug: 'rickosborne',
    github: '',
    author: '',
    link: '',
  },
  {
    name: 'Flat',
    slug: 'flat',
    github: 'erming',
    author: 'Mattias Erming',
    link: 'https://github.com/erming',
  },
  {
    name: 'One Page Plus',
    slug: 'onepage-plus',
    github: '',
    author: '',
    link: '',
  },
  {
    name: 'Paper',
    slug: 'paper-plus-plus',
    github: '',
    author: '',
    link: '',
  },
];

// New themes from themes.json
const newThemes = themesData.themes.map((theme) => ({
  name: theme.name,
  slug: theme.id,
  author: theme.author,
  link:
    theme.previewUrl ||
    `https://registry.jsonresume.org/thomasdavis?theme=${theme.id}`,
  description: theme.description,
  tags: theme.tags,
  screenshot: theme.screenshot,
}));

// Combine existing themes with new themes, removing duplicates by slug
const existingSlugs = new Set(existingThemes.map((t) => t.slug));
const uniqueNewThemes = newThemes.filter((t) => !existingSlugs.has(t.slug));

// Also update existing themes to use new screenshots if available
const newThemesMap = new Map(newThemes.map((t) => [t.slug, t]));
const updatedExistingThemes = existingThemes.map((theme) => {
  const newTheme = newThemesMap.get(theme.slug);
  if (newTheme && newTheme.screenshot) {
    return { ...theme, screenshot: newTheme.screenshot };
  }
  return theme;
});

export const themes = [...updatedExistingThemes, ...uniqueNewThemes];
