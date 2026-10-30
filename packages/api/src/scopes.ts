/**
 * What an app connected with OAuth may do, as it asks in `scope` and the
 * consent page shows it. `openid` asks for an OpenID Connect ID token
 * as well. `mcp` is everything an agent's tools can do, so it
 * includes every other scope.
 */
export const SCOPES = {
  openid: 'Sign you in with your JSON Resume account',
  profile: 'See your username, name and photo',
  email: 'See your email address',
  'resume:read': 'Read your resume',
  'resume:write':
    'Change your resume (saved to your gist when your page reads from it)',
  mcp: 'Everything an agent can do through MCP: your resume, theme, readers, listing and jobs',
} as const;

export type Scope = keyof typeof SCOPES;

export const SCOPE_NAMES = Object.keys(SCOPES) as ReadonlyArray<Scope>;

const isScope = (name: string): name is Scope => name in SCOPES;

/**
 * The scopes a `scope` parameter asks for, in a stable order, or undefined
 * when it names one that doesn't exist. Asking for none gets `fallback`.
 */
export const parseScope = (
  raw: string | undefined,
  fallback: Scope
): ReadonlyArray<Scope> | undefined => {
  const asked = (raw ?? '').split(' ').filter(Boolean);
  if (asked.length === 0) return [fallback];
  if (!asked.every(isScope)) return undefined;
  return SCOPE_NAMES.filter((s) => asked.includes(s));
};

/** Whether a granted scope string allows `needed`. */
export const allows = (granted: string, needed: Scope) => {
  const names = granted.split(' ');
  return names.includes(needed) || names.includes('mcp');
};
