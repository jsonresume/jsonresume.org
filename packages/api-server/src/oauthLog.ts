import type { OAuthError } from '@repo/api';
import { Effect } from 'effect';

/**
 * Logs why an OAuth request was refused (the error and the public client id,
 * never a token or code), so a client stuck on invalid_grant can be told
 * apart from a bad request, and named.
 */
export const logRefusal =
  (endpoint: string, grant?: string, client?: string) =>
  <A, R>(self: Effect.Effect<A, OAuthError, R>) =>
    Effect.tapError(self, (e) =>
      Effect.logInfo('oauth refused', {
        endpoint,
        grant,
        client,
        error: e.error,
        description: e.error_description,
      })
    );
