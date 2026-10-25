import { Schema } from 'effect';

/** GitHub's login rules: letters, digits and single inner hyphens, 1 to 39 long. */
const USERNAME = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/;

/** Names no account can hold (see docs/ACCOUNTS_AND_USERNAMES.md). */
export const reservedUsernames: ReadonlySet<string> = new Set([
  'admin',
  'api',
  'help',
  'jsonresume',
  'registry',
  'root',
  'support',
  'www',
]);

/** A username, stored and compared lowercase. */
export const Username = Schema.String.pipe(
  Schema.check(Schema.isPattern(USERNAME)),
  Schema.brand('Username')
);
export type Username = typeof Username.Type;

/** The formats a resume is served in, by file extension. */
export const resumeFormats = [
  'html',
  'json',
  'yaml',
  'txt',
  'pdf',
  'qr',
  'rendercv',
] as const;
export type ResumeFormat = (typeof resumeFormats)[number];

export interface Handle {
  username: Username;
  /** The requested extension, lowercase; 'html' when there is none. */
  extension: string;
  /** The format, or undefined for an extension we don't serve. */
  format: ResumeFormat | undefined;
  /** False when the request used capitals, e.g. /@Foo, which redirect. */
  canonical: boolean;
}

const isFormat = (value: string): value is ResumeFormat =>
  (resumeFormats as ReadonlyArray<string>).includes(value);

const isUsername = Schema.is(Username);

/** Read `@name` or `@name.ext` (a path segment). Undefined when it is not a username. */
export function parseHandle(segment: string): Handle | undefined {
  const match = /^@([^./]+)(?:\.([a-z0-9]+))?$/i.exec(segment);
  if (!match?.[1]) return undefined;
  const username = match[1].toLowerCase();
  if (!isUsername(username)) return undefined;
  const extension = (match[2] ?? 'html').toLowerCase();
  return {
    username,
    extension,
    format: isFormat(extension) ? extension : undefined,
    canonical: segment === segment.toLowerCase(),
  };
}

/** The path of a resume: /@name, or /@name.json for other formats. */
export const handlePath = (username: string, format: ResumeFormat = 'html') =>
  format === 'html' ? `/@${username}` : `/@${username}.${format}`;
