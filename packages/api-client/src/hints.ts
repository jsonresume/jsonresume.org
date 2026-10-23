import { SIGNED_IN_HINT } from '@repo/api/cookies';
import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/**
 * False during server rendering and hydration, true after: render API data
 * only once this is true, so prerendered HTML and the first client render
 * match and no request is made on the server.
 */
export const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false
  );

const hasHint = () =>
  document.cookie.split('; ').some((c) => c === `${SIGNED_IN_HINT}=1`);

/**
 * Whether this browser is probably signed in, from the readable hint cookie
 * set beside the session. A hint only: pages that need the user ask the API.
 */
export const useSignedInHint = () =>
  useSyncExternalStore(noop, hasHint, () => false);
