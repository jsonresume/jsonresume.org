import { Accounts } from '@repo/accounts';
import { EmailSettings, EmailSettingsChange } from '@repo/api';
import { emailSettings, setEmailSettings } from '@repo/job-digest';
import { PreferenceStore } from '@repo/jobs';
import { Context, Effect } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, hints } from './context';

export const EmailToolkit = Toolkit.make(
  Tool.make('get_email_settings', {
    description: describe('get_email_settings'),
    success: EmailSettings,
    ...failing,
  }).annotateMerge(hints('get_email_settings')),
  Tool.make('set_email_settings', {
    description: describe('set_email_settings'),
    parameters: EmailSettingsChange,
    success: EmailSettings,
    ...failing,
  }).annotateMerge(hints('set_email_settings', true))
);

/** Needs Accounts and PreferenceStore. */
export const EmailHandlers = EmailToolkit.toLayer(
  Effect.gen(function* () {
    const services = Context.make(Accounts, yield* Accounts).pipe(
      Context.add(PreferenceStore, yield* PreferenceStore)
    );
    return {
      get_email_settings: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          return yield* emailSettings(user.id);
        }).pipe(Effect.provide(services)),
      set_email_settings: (change) =>
        Effect.gen(function* () {
          const user = yield* caller;
          return yield* setEmailSettings(user.id, change, 'agent');
        }).pipe(Effect.provide(services)),
    };
  })
);
