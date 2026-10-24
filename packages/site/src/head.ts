import { siteUrl } from './links';

export interface PageHeadInput {
  /** Page title; " · JSON Resume" is appended unless it already names the site. */
  title: string;
  description: string;
  /** Path of the page, for the canonical URL. Omit for pages that should not be indexed. */
  path?: string;
  /** 'article' for blog posts. */
  type?: 'website' | 'article';
}

/**
 * The `head` option for a route: title, description, canonical link and
 * Open Graph/Twitter tags, the same way on every page.
 */
export function pageHead({
  title,
  description,
  path,
  type = 'website',
}: PageHeadInput) {
  const fullTitle = /JSON Resume/.test(title)
    ? title
    : `${title} · JSON Resume`;
  const url =
    path === undefined ? undefined : `${siteUrl}${path === '/' ? '/' : path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'JSON Resume' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      ...(url
        ? [{ property: 'og:url', content: url }]
        : [{ name: 'robots', content: 'noindex' }]),
      // The link-preview card (1200×630), the same for every page.
      { property: 'og:image', content: `${siteUrl}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: url ? [{ rel: 'canonical', href: url }] : [],
  };
}
