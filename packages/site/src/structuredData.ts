import { external, paths, siteUrl } from './links';

/**
 * Schema.org structured data (JSON-LD) for the site's pages: who publishes
 * it, how to search it, where a page sits. Rendered by the route's head as
 * `<script type="application/ld+json">` (see pageHead).
 */
export type JsonLd = Readonly<Record<string, unknown>>;

/** One step of a page's breadcrumb trail: a name and its path. */
export interface Crumb {
  name: string;
  path: string;
}

const context = 'https://schema.org';
const organizationId = `${siteUrl}/#organization`;
const absolute = (path: string) => `${siteUrl}${path === '/' ? '/' : path}`;

/** The JSON Resume project, the publisher of every page. */
export const organization = (): JsonLd => ({
  '@context': context,
  '@type': 'Organization',
  '@id': organizationId,
  name: 'JSON Resume',
  url: absolute('/'),
  logo: `${siteUrl}/favicon.svg`,
  sameAs: [external.github, 'https://github.com/jsonresume'],
});

/** The site, searchable through Explore (/explore?q=). */
export const webSite = (): JsonLd => ({
  '@context': context,
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'JSON Resume',
  url: absolute('/'),
  publisher: { '@id': organizationId },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}${paths.explore}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/** Home, then each crumb in order: where a page sits on the site. */
export const breadcrumbList = (crumbs: ReadonlyArray<Crumb>): JsonLd => ({
  '@context': context,
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: paths.home }, ...crumbs].map(
    (crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })
  ),
});

/** A blog post: its headline, author and date. */
export const blogPosting = (post: {
  title: string;
  description?: string;
  date: string;
  author: string;
  path: string;
}): JsonLd => ({
  '@context': context,
  '@type': 'BlogPosting',
  headline: post.title,
  ...(post.description ? { description: post.description } : {}),
  datePublished: post.date,
  author: { '@type': 'Person', name: post.author },
  publisher: { '@id': organizationId },
  mainEntityOfPage: absolute(post.path),
  image: `${siteUrl}/og.png`,
});
