const SITE_NAME = 'JSON Resume';

// Rendered by app/opengraph-image.js. Listed explicitly because a page's
// openGraph object replaces the layout's, image included.
const IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'JSON Resume — the open-source, JSON-based standard for resumes',
};

/**
 * Next.js metadata for a homepage route, including the Open Graph and Twitter
 * tags link previews use.
 */
export function pageMetadata({ title, description, url: rawUrl }) {
  // The site redirects /path/ to /path, so canonical URLs drop the slash
  const url = rawUrl.replace(/(?<=[^/])\/$/, '');
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [IMAGE.url],
    },
  };
}
