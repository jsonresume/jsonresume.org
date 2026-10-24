import { JsonResumeApi, type AnalyticsRange } from '@repo/api';
import { FetchHttpClient } from 'effect/http';
import { Atom, AtomHttpApi } from 'effect/reactivity';

/**
 * The jsonresume.org API from the browser, same origin (cookies included).
 * Queries are atoms; mutations are atom functions that refresh the queries
 * sharing their reactivity keys.
 */
export class ApiClient extends AtomHttpApi.Service<ApiClient>()(
  '@repo/api-client/ApiClient',
  {
    api: JsonResumeApi,
    httpClient: FetchHttpClient.layer,
    baseUrl:
      typeof location === 'undefined' ? 'http://localhost' : location.origin,
  }
) {}

/** Keys mutations invalidate, so the queries reading that data refetch. */
export const keys = {
  session: ['session'],
  account: ['account'],
  analytics: ['analytics'],
  jobs: ['jobs'],
  apiKeys: ['apiKeys'],
} as const;

export const sessionAtom = ApiClient.query('auth', 'session', {
  reactivityKeys: keys.session,
});
export const accountAtom = ApiClient.query('account', 'get', {
  reactivityKeys: keys.account,
});
export const overviewAtom = Atom.family((range: AnalyticsRange) =>
  ApiClient.query('analytics', 'overview', {
    query: { range },
    reactivityKeys: keys.analytics,
  })
);
export const usernameCheckAtom = Atom.family((name: string) =>
  ApiClient.query('auth', 'checkUsername', { query: { name } })
);
/** Jobs ranked against the resume; a new resume (account key) reranks them. */
export const jobMatchesAtom = ApiClient.query('myJobs', 'matches', {
  reactivityKeys: [...keys.jobs, ...keys.account],
});
export const pendingGithubAtom = ApiClient.query('auth', 'pendingGithub', {});

export const signUpAtom = ApiClient.mutation('auth', 'signUp');
export const signInAtom = ApiClient.mutation('auth', 'signIn');
export const signOutAtom = ApiClient.mutation('auth', 'signOut');
export const completeGithubAtom = ApiClient.mutation('auth', 'completeGithub');
export const resendVerificationAtom = ApiClient.mutation(
  'auth',
  'resendVerification'
);
export const saveResumeAtom = ApiClient.mutation('account', 'saveResume');
export const setSourceAtom = ApiClient.mutation('account', 'setSource');
export const forgotPasswordAtom = ApiClient.mutation('auth', 'forgotPassword');
export const resetPasswordAtom = ApiClient.mutation('auth', 'resetPassword');
export const renameAtom = ApiClient.mutation('account', 'rename');
export const deleteAccountAtom = ApiClient.mutation('account', 'delete');
/** Marks a job; the page shows it at once rather than reranking. */
export const markJobAtom = ApiClient.mutation('myJobs', 'mark');
/** The user's API keys; creating or revoking one refreshes the list. */
export const apiKeysAtom = ApiClient.query('keys', 'list', {
  reactivityKeys: keys.apiKeys,
});
export const createApiKeyAtom = ApiClient.mutation('keys', 'create');
export const revokeApiKeyAtom = ApiClient.mutation('keys', 'revoke');
