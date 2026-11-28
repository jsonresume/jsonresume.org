/**
 * What a link picks up when it is pasted from a sentence: the full stop,
 * comma or bracket after it (jsonresume.org/schema). or (see /@name),),
 * percent-encoded or not.
 */
const TRAILING = /[)\]}>.,;:!'"`*\s’”»]+$/u;

/** What a path of ours is made of: /@name, /schema, /themes/flat-ui. */
const SITE_PATH = /^\/[A-Za-z0-9@._~/-]*$/;

const decoded = (path: string) => {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
};

/**
 * A path that missed everything because of punctuation stuck to its end:
 * a redirect to it without (to the home page when nothing is left), when
 * what is left looks like one of our paths: a resume's placeholder link
 * (/[LinkedIn URL]) stays a 404. Runs only after every page and file missed.
 */
export const strayPunctuation = (request: Request) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return;
  const url = new URL(request.url);
  const path = decoded(url.pathname);
  const trimmed = path.replace(TRAILING, '');
  if (trimmed === path || !SITE_PATH.test(trimmed)) return;
  return new Response(null, {
    status: 301,
    headers: { location: `${encodeURI(trimmed)}${url.search}` },
  });
};
