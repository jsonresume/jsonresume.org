import { OAuth } from '@repo/accounts';
import { AppListing } from '@repo/api';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

export const DirectoryToolkit = Toolkit.make(
  Tool.make('list_app_directory', {
    description: describe('list_app_directory'),
    success: Schema.Struct({ apps: Schema.Array(AppListing) }),
    ...failing,
  }).annotateMerge(hints('list_app_directory')),
  Tool.make('set_app_listing', {
    description: describe('set_app_listing'),
    parameters: Schema.Struct({
      client_id: Schema.String.annotate({
        description: 'Your app’s client_id',
      }),
      listed: Schema.Boolean,
      description: Schema.String.annotate({
        description: 'What the app does, in one line (up to 160 characters)',
      }),
    }),
    success: Schema.Struct({ listed: Schema.Boolean }),
    ...failing,
  }).annotateMerge(hints('set_app_listing', true))
);

/** Needs OAuth. */
export const DirectoryHandlers = DirectoryToolkit.toLayer(
  Effect.gen(function* () {
    const oauth = yield* OAuth;
    return {
      list_app_directory: () =>
        Effect.map(oauth.directory(), (apps) => ({ apps })),
      set_app_listing: ({ client_id, listed, description }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          yield* oauth
            .setListing(user.id, client_id, { listed, description })
            .pipe(Effect.mapError((e) => failWith(e.description)));
          return { listed };
        }),
    };
  })
);
