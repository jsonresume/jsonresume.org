import { parseHandle } from '@repo/profiles';

const SITE = 'https://jsonresume.org';

/** registry.jsonresume.org pages with a direct counterpart here. */
const COUNTERPARTS: Record<string, string> = {
  login: '/signin',
  signup: '/signup',
  editor: '/dashboard/editor',
  settings: '/dashboard/settings',
  docs: '/docs',
  jobs: '/jobs',
  'my-jobs': '/dashboard/jobs',
};

/** The registry's own pages, which are not usernames. */
const FEATURES = new Set([
  'api',
  'api-keys',
  'auth',
  'explore',
  'explore2',
  'job-similarity',
  'jobs',
  'my-jobs',
  'pathways',
  'privacy',
  'terms',
  'similarity',
  'style-guide',
  'debug',
  'resumes',
  'candidates',
  '_next',
]);

/** The registry's /api endpoints (pages/api), which are not usernames. */
const API_ROUTES = new Set([
  'candidates',
  'export',
  'interview',
  'jobs',
  'jobs-graph',
  'letter',
  'relevant-jobs',
  'schema',
  'suggestions',
  'suggestions-beta',
  'theme',
  'themes',
  'openAIStream',
]);

/** Formats the registry served that are pages here: the theme. */
const PAGE_FORMATS = new Set(['html', 'template']);

/**
 * Where an old registry.jsonresume.org URL lives now, on jsonresume.org.
 * Resumes (/thomasdavis, /thomasdavis.json?theme=x, /api/thomasdavis)
 * move to /@thomasdavis with their format and query; pages with a
 * counterpart go to it; everything else, the registry's features that
 * haven't moved yet, goes to /registry, which says what's coming.
 */
export function registryRedirect(url: URL): string {
  const segments = url.pathname.split('/').filter(Boolean);
  const [first, second, ...rest] = segments;
  if (!first) return `${SITE}/registry`;
  // Registry job pages were keyed by the Hacker News item id, as here.
  if (first === 'jobs' && second && /^\d+$/.test(second) && rest.length === 0)
    return `${SITE}/jobs/${second}`;
  const counterpart = COUNTERPARTS[first];
  if (counterpart)
    return `${SITE}${counterpart}${counterpart === '/docs' ? '' : url.search}`;

  // The registry's API answered /api/{username}(.ext) like the resume page.
  const apiResume =
    second !== undefined &&
    rest.length === 0 &&
    !API_ROUTES.has(second.split('.')[0] ?? '');
  const resumeSegment =
    first === 'api'
      ? apiResume
        ? second
        : undefined
      : second
      ? undefined
      : first;
  if (resumeSegment && (first === 'api' || !FEATURES.has(first))) {
    const handle = parseHandle(`@${resumeSegment.replace(/^%40/i, '')}`);
    if (handle) {
      const ext = PAGE_FORMATS.has(handle.extension)
        ? ''
        : `.${handle.extension}`;
      return `${SITE}/@${handle.username}${ext}${url.search}`;
    }
  }
  return `${SITE}/registry`;
}
