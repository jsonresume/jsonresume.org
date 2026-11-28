import { Accounts } from '@repo/accounts';
import { HiddenField, Privacy } from '@repo/api';
import { track } from '@repo/posthog';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, hints } from './context';

export const PrivacyToolkit = Toolkit.make(
  Tool.make('get_hidden_fields', {
    description: describe('get_hidden_fields'),
    success: Privacy,
    ...failing,
  }).annotateMerge(hints('get_hidden_fields')),
  Tool.make('set_hidden_fields', {
    description: describe('set_hidden_fields'),
    parameters: Schema.Struct({
      hidden: Schema.Array(HiddenField).annotate({
        description:
          'Every detail to keep off the public page: any of email, phone, address. An empty list shows them all.',
      }),
    }),
    success: Privacy,
    ...failing,
  }).annotateMerge(hints('set_hidden_fields', true)),
  Tool.make('set_page_private', {
    description: describe('set_page_private'),
    parameters: Schema.Struct({
      private: Schema.Boolean.annotate({
        description:
          'true: only you, signed in, see your page. false: anyone with the link sees it.',
      }),
    }),
    success: Privacy,
    ...failing,
  }).annotateMerge(hints('set_page_private', true))
);

/** Needs Accounts. */
export const PrivacyHandlers = PrivacyToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    return {
      get_hidden_fields: () =>
        Effect.flatMap(caller, (user) => accounts.privacy(user.id)),
      set_hidden_fields: ({ hidden }) =>
        Effect.flatMap(caller, (user) =>
          accounts.changePrivacy(user.id, { hidden })
        ),
      set_page_private: (params) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const before = yield* accounts.pagePrivate(user.id);
          const after = yield* accounts.changePrivacy(user.id, {
            pagePrivate: params.private,
          });
          if (after.pagePrivate !== before)
            yield* track(user.id, 'page_privacy_changed', {
              private: after.pagePrivate,
              via: 'mcp',
            });
          return after;
        }),
    };
  })
);
