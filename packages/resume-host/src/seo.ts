import {
  canonicalUrl,
  clip,
  profileOf,
  profilePage,
  SITE,
} from './profileData';

/** Text safe inside an HTML attribute or element. */
const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** JSON that can't close the script tag it sits in. */
const scriptJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const CANONICAL = /<link\b[^>]*\brel=["']?canonical["']?[^>]*>/gi;
const TITLE = /<title\b[^>]*>\s*\S[\s\S]*?<\/title>/i;

/** Whether the theme already set this meta name or property. */
const hasMeta = (html: string, key: string) =>
  new RegExp(
    `<meta\\b[^>]*\\b(?:name|property)=["']?${key.replace(
      /[.:]/g,
      '\\$&'
    )}["'\\s>]`,
    'i'
  ).test(html);

/** The tags a resume page gets: the theme's own win, except canonical. */
const headTags = (html: string, username: string, resume: unknown) => {
  const profile = profileOf(username, resume);
  const url = canonicalUrl(username);
  const title = profile.label
    ? `${profile.name} – ${profile.label}`
    : profile.name;
  const description = clip(
    [
      profile.label ? `${profile.name}, ${profile.label}.` : profile.name,
      profile.summary,
    ]
      .filter(Boolean)
      .join(' '),
    160
  );
  const meta: Array<[string, string, string]> = [
    ['name', 'description', description],
    ['property', 'og:type', 'profile'],
    ['property', 'og:site_name', 'JSON Resume'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', profile.image ?? `${SITE}/og.png`],
    ['property', 'profile:username', username],
    ['name', 'twitter:card', profile.image ? 'summary' : 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ];
  return [
    TITLE.test(html)
      ? ''
      : `<title>${escape(`${title} · JSON Resume`)}</title>`,
    `<link rel="canonical" href="${escape(url)}">`,
    ...meta
      .filter(([, key]) => !hasMeta(html, key))
      .map(
        ([attr, key, content]) =>
          `<meta ${attr}="${key}" content="${escape(content)}">`
      ),
    `<script type="application/ld+json">${scriptJson(
      profilePage(username, resume)
    )}</script>`,
  ].join('');
};

/**
 * A themed resume page with what search engines and link previews read:
 * the canonical URL (the clean /@username, whatever ?theme= or other query
 * it was opened with), a description, Open Graph and Twitter tags the theme
 * didn't set, and ProfilePage structured data from the resume's public
 * fields. Added at the end of <head>.
 */
export function withProfileHead(
  html: string,
  username: string,
  resume: unknown
): string {
  const page = html.replace(CANONICAL, '');
  const tags = headTags(page, username, resume);
  const end = page.search(/<\/head>/i);
  if (end !== -1) return page.slice(0, end) + tags + page.slice(end);
  const start = /<head\b[^>]*>/i.exec(page);
  if (start)
    return (
      page.slice(0, start.index + start[0].length) +
      tags +
      page.slice(start.index + start[0].length)
    );
  return tags + page;
}

/**
 * The same resume as a file (.pdf, .json, …): its page is the canonical
 * copy, said in a Link header (search engines read it on non-HTML files).
 */
export const withCanonicalLink = (response: Response, username: string) => {
  response.headers.set('link', `<${canonicalUrl(username)}>; rel="canonical"`);
  return response;
};
