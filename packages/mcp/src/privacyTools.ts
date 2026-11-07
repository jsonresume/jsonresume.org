import { Accounts } from '@repo/accounts';
import { HiddenField, Privacy } from '@repo/api';
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
  }).annotateMerge(hints('set_hidden_fields', true))
);

/** Needs Accounts. */
export const PrivacyHandlers = PrivacyToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    return {
      get_hidden_fields: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          return { hidden: yield* accounts.hiddenFields(user.id) };
        }),
      set_hidden_fields: ({ hidden }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          yield* accounts.setHiddenFields(user.id, hidden);
          return { hidden: yield* accounts.hiddenFields(user.id) };
        }),
    };
  })
);
