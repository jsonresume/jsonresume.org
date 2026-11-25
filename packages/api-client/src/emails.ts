import { Atom } from 'effect/reactivity';
import { ApiClient, keys } from './client';

/** Which emails the signed-in account gets. */
export const emailSettingsAtom = ApiClient.query('account', 'emails', {
  reactivityKeys: keys.emails,
});
export const setEmailSettingsAtom = ApiClient.mutation('account', 'setEmails');

/** The same, by an email's link: `user` and `token` joined by a newline. */
export const linkEmailSettingsAtom = Atom.family((key: string) => {
  const [user = '', token = ''] = key.split('\n');
  return ApiClient.query('emailSettings', 'get', {
    query: { user, token },
    reactivityKeys: keys.emails,
  });
});
export const setLinkEmailSettingsAtom = ApiClient.mutation(
  'emailSettings',
  'set'
);
