import { THEME_METADATA } from '@jsonresume/theme-metadata';

/** Every theme the registry can render. */
export const themeCount = Object.keys(THEME_METADATA).length;

/** A varied handful for the home page, each with a screenshot in public/img/themes. */
const FEATURED = [
  'art-school-modern',
  'sidebar-photo-strip',
  'bold-header-statement',
  'art-deco',
  'typewriter-modern',
  'brutalist',
  'desert-modern',
  'kendall',
] as const;

export interface FeaturedTheme {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const featuredThemes: FeaturedTheme[] = FEATURED.map((slug) => {
  const meta = THEME_METADATA[slug];
  if (!meta) throw new Error(`Unknown featured theme: ${slug}`);
  return {
    slug,
    name: meta.name,
    description: meta.description,
    image: `/img/themes/${slug}.webp`,
  };
});
