import crypto from 'crypto';

/**
 * HMAC-based API key authentication.
 * Key format: jr_{username}_{hmac}
 * No database table needed — the server verifies the HMAC using a secret.
 */

function getSecret() {
  // Use SUPABASE_KEY as the HMAC secret (always available)
  return process.env.SUPABASE_KEY;
}

/**
 * Generate an API key for a username.
 */
export function generateKey(username) {
  const hmac = crypto
    .createHmac('sha256', getSecret())
    .update(username)
    .digest('hex')
    .slice(0, 32);
  return `jr_${username}_${hmac}`;
}

/**
 * Authenticate request via Bearer token (API key).
 * Returns { username } or null.
 */
export async function authenticate(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const key = authHeader.slice(7);
  if (!key) return null;

  // Parse key: jr_{username}_{hmac}
  const match = key.match(/^jr_(.+)_([a-f0-9]{32})$/);
  if (!match) return null;

  const username = match[1];
  const expectedKey = generateKey(username);

  if (key !== expectedKey) return null;

  return { username };
}
