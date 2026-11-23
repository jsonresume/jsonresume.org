/** RFC 9116 asks for an expiry under a year away; each release renews it. */
const VALID_DAYS = 180;

/**
 * /.well-known/security.txt (RFC 9116): where to report a vulnerability.
 * GitHub's private reporting is the channel we can be sure reaches us;
 * SECURITY.md is the policy.
 */
export const securityTxt = (site: string, now = new Date()) => {
  const expires = new Date(now.getTime() + VALID_DAYS * 24 * 60 * 60 * 1000);
  return [
    'Contact: https://github.com/jsonresume/jsonresume.org/security/advisories/new',
    'Contact: mailto:security@jsonresume.org',
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Policy: https://github.com/jsonresume/jsonresume.org/blob/master/SECURITY.md',
    'Preferred-Languages: en',
    `Canonical: ${site}/.well-known/security.txt`,
    '',
  ].join('\n');
};

export const securityTxtRoute = (site: string) => {
  const body = securityTxt(site);
  return {
    path: '/.well-known/security.txt',
    fetch: async () =>
      new Response(body, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'public, max-age=86400',
        },
      }),
  };
};
