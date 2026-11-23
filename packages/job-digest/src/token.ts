import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * The unsubscribe link's token: an HMAC of the user id under AUTH_SECRET, so
 * anyone holding the email can stop it and nobody can stop someone else's.
 */
export const digestToken = (secret: string, userId: string) =>
  createHmac('sha256', secret)
    .update(`job-digest:${userId}`)
    .digest('base64url');

export const validDigestToken = (
  secret: string,
  userId: string,
  token: string
) => {
  const want = Buffer.from(digestToken(secret, userId));
  const got = Buffer.from(token);
  return got.length === want.length && timingSafeEqual(got, want);
};
