import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * The token in every email's settings and unsubscribe links: an HMAC of the
 * user id under AUTH_SECRET, so whoever holds the email can change its
 * settings without signing in, and nobody can change someone else's.
 */
export const emailToken = (secret: string, userId: string) =>
  createHmac('sha256', secret).update(`emails:${userId}`).digest('base64url');

export const validEmailToken = (
  secret: string,
  userId: string,
  token: string
) => {
  const want = Buffer.from(emailToken(secret, userId));
  const got = Buffer.from(token);
  return got.length === want.length && timingSafeEqual(got, want);
};

/** Which emails a one-click unsubscribe stops. */
export type EmailKind = 'account' | 'weekly' | 'all';

/** What an email needs to be stopped or changed in one or two clicks. */
export interface EmailLinks {
  /** The /emails page: every email's on/off switch, no sign-in needed. */
  settings: string;
  /** List-Unsubscribe, so mail apps offer their own one-click button (RFC 8058). */
  headers: Record<string, string>;
}

export const emailLinks = (
  site: string,
  secret: string,
  userId: string,
  kind: EmailKind
): EmailLinks => {
  const query = `user=${encodeURIComponent(userId)}&token=${emailToken(
    secret,
    userId
  )}`;
  return {
    settings: `${site}/emails?${query}`,
    headers: {
      'List-Unsubscribe': `<${site}/api/email-settings/stop?${query}&kind=${kind}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
};

/** The footer and headers of an email people can turn off. */
export const optional = (why: string, links: EmailLinks) => ({
  reason: {
    text: why,
    links: [
      {
        label: 'Unsubscribe or change your email settings',
        url: links.settings,
      },
    ],
  },
  headers: links.headers,
});
