import { postParagraphs } from './postText';

/** Sites whose front page is never the employer's own. */
const NOT_COMPANIES = new Set([
  'news.ycombinator.com',
  'ycombinator.com',
  'linkedin.com',
  'github.com',
  'twitter.com',
  'x.com',
  'wellfound.com',
  'angel.co',
  'bit.ly',
]);

const URLS = /https?:\/\/[^\s|()<>"']+/gi;

const parse = (text: string): URL | null => {
  const trimmed = text.replace(/[.,;:!?]+$/, '');
  return URL.canParse(trimmed) ? new URL(trimmed) : null;
};

const hostOf = (url: URL) => url.hostname.toLowerCase().replace(/^www\./, '');

/**
 * The employer's website, when the post's header line links a front page:
 * HN posts open "Company | Location | … | https://company.com". Links with a
 * path are left out (they are usually the application or a job board), so
 * a company is never guessed from an apply link.
 */
export const homepageOf = (html: string): string | undefined => {
  const [header = ''] = postParagraphs(html);
  for (const match of header.match(URLS) ?? []) {
    const url = parse(match);
    if (!url || url.search || url.hash) continue;
    if (url.pathname !== '/' && url.pathname !== '') continue;
    if (NOT_COMPANIES.has(hostOf(url))) continue;
    return url.origin;
  }
  return undefined;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Apply {
  readonly url?: string;
  readonly email?: string;
  readonly instructions?: string;
}

/** The parser's apply text (a URL, an email, or words) as job-schema `apply`. */
export const applyOf = (apply: string | null): Apply | undefined => {
  const text = apply?.trim() ?? '';
  if (!text) return undefined;
  const address = text.replace(/^mailto:/i, '');
  if (EMAIL.test(address)) return { email: address };
  const url = parse(text);
  if (url && (url.protocol === 'https:' || url.protocol === 'http:'))
    return { url: url.href };
  return { instructions: text };
};
