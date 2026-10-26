import { useAtomMount } from '@effect/atom-react';
import { AnalyticsRange } from '@repo/api';
import {
  accountAtom,
  apiKeysAtom,
  oauthAppsAtom,
  connectionsAtom,
  currentResumeAtom,
  exploreListingAtom,
  jobMatchesAtom,
  overviewAtom,
} from '@repo/api-client';
import { Schema } from 'effect';
import type { Atom } from 'effect/reactivity';

const isRange = Schema.is(AnalyticsRange);

/** The data a dashboard page reads first, by path. */
export const pageData = (
  pathname: string,
  search: string
): ReadonlyArray<Atom.Atom<unknown>> => {
  switch (pathname) {
    case '/dashboard': {
      const range = new URLSearchParams(search).get('range');
      return [
        accountAtom,
        currentResumeAtom,
        overviewAtom(range !== null && isRange(range) ? range : '30d'),
      ];
    }
    case '/dashboard/editor':
    case '/dashboard/resume':
      return [accountAtom, currentResumeAtom];
    case '/dashboard/settings':
      return [
        accountAtom,
        exploreListingAtom,
        connectionsAtom,
        apiKeysAtom,
        oauthAppsAtom,
      ];
    case '/dashboard/jobs':
      return [jobMatchesAtom];
    default:
      return [];
  }
};

function Mount({ atom }: { atom: Atom.Atom<unknown> }) {
  useAtomMount(atom);
  return null;
}

/**
 * Starts the page's requests alongside the session check instead of after
 * it: the page reads the same atoms, so it finds them loaded or loading.
 */
export function Prefetch({ pathname }: { pathname: string }) {
  const search = typeof location === 'undefined' ? '' : location.search;
  return pageData(pathname, search).map((atom, i) => (
    <Mount key={`${pathname} ${i}`} atom={atom} />
  ));
}
