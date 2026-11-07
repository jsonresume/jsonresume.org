import { siteUrl } from './links';
import { breadcrumbList, type Crumb, type JsonLd } from './structuredData';

export interface PageHeadInput {
  /** Page title; " · JSON Resume" is appended unless it already names the site. */
  title: string;
  description: string;
  /**
   * Path of the page, for the canonical URL. Omit for pages that should not
   * be indexed. Query strings (?theme=, ?q=) never belong here: every
   * variant of a page names the clean URL as canonical.
   */
  path?: string;
  /** 'article' for blog posts. */
  type?: 'website' | 'article';
  /**
   * The pages above this one, below Home, for its breadcrumb trail (e.g.
   * Blog for a post). Indexed pages other than Home get a BreadcrumbList.
   */
  parents?: ReadonlyArray<Crumb>;
  /** This page's name in breadcrumbs, when shorter than its title. */
  crumb?: string;
  /** More structured data: WebSite, Organization, BlogPosting, … */
  jsonLd?: ReadonlyArray<JsonLd>;
  /** The link-preview image, a path here, with its size; else the site's card. */
  image?: { path: string; width: number; height: number };
}

/**
 * The `head` option for a route: title, description, canonical link,
 * Open Graph/Twitter tags and structured data, the same way on every page.
 */
export function pageHead({
  title,
  description,
  path,
  type = 'website',
  parents = [],
  crumb,
  jsonLd = [],
  image = { path: '/og.png', width: 1200, height: 630 },
}: PageHeadInput) {
  const fullTitle = /JSON Resume/.test(title)
    ? title
    : `${title} · JSON Resume`;
  const url =
    path === undefined ? undefined : `${siteUrl}${path === '/' ? '/' : path}`;
  const trail =
    path === undefined || path === '/'
      ? []
      : [breadcrumbList([...parents, { name: crumb ?? title, path }])];
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
      // The link-preview card: the site's (1200×630) unless the page has one.
      { property: 'og:image', content: `${siteUrl}${image.path}` },
      { property: 'og:image:width', content: String(image.width) },
      { property: 'og:image:height', content: String(image.height) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
    ],
    links: url ? [{ rel: 'canonical', href: url }] : [],
    scripts: [...jsonLd, ...trail].map((data) => ({
      type: 'application/ld+json',
      // JSON that can't close the script tag it sits in.
      children: JSON.stringify(data).replace(/</g, '\\u003c'),
    })),
  };
}
