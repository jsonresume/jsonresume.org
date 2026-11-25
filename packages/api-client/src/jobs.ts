import { ApiClient, keys } from './client';

/** Job decisions at once (wait=0): what's decided so far, while jobDecisionsAtom waits for the models. */
export const jobDecisionsNowAtom = ApiClient.query(
  'jobDecisions',
  'decisions',
  {
    query: { wait: 0 },
    reactivityKeys: [...keys.jobs, ...keys.account],
  }
);
/** Saves what they want; pass reactivityKeys: keys.jobs to decide again. */
export const saveJobPreferencesAtom = ApiClient.mutation(
  'jobDecisions',
  'savePreferences'
);
/** Where the resume could go: the fitting jobs grouped by kind of role. */
export const directionsAtom = ApiClient.query('myJobs', 'directions', {
  reactivityKeys: [...keys.jobs, ...keys.account],
});
