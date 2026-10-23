import { Context, Effect, Layer, Schema } from 'effect';

/** A copy of a gist resume, with where it came from and when. */
export const GistMirror = Schema.Struct({
  githubId: Schema.Number,
  gistId: Schema.String,
  resume: Schema.Unknown,
  fetchedAt: Schema.Date,
});
export type GistMirror = typeof GistMirror.Type;

/**
 * A profile nobody owns yet: the mirror of GitHub user `username`'s
 * resume.json gist, kept so pages load without asking GitHub every time.
 */
export const GhostProfile = Schema.Struct({
  username: Schema.String,
  ...GistMirror.fields,
});
export type GhostProfile = typeof GhostProfile.Type;

/** A username an account holds. */
export interface AccountProfile {
  kind: 'account';
  username: string;
  userId: string;
  /** Verified (by email or GitHub): only then is the page public. */
  verified: boolean;
  /** The linked GitHub login, whose gist is the resume when source is gist. */
  githubLogin: string | undefined;
  source: 'gist' | 'stored';
  mirror: GistMirror | undefined;
  stored: unknown;
}

/** A name that redirects to an account (a merged ghost, or a rename). */
export interface AliasProfile {
  kind: 'alias';
  username: string;
  target: string;
}

export type Profile =
  | ({ kind: 'ghost' } & GhostProfile)
  | AccountProfile
  | AliasProfile;

/** Where profiles are kept. Postgres in production (./sql), memory in tests. */
export class ProfileStore extends Context.Service<
  ProfileStore,
  {
    find(username: string): Effect.Effect<Profile | undefined>;
    saveGhost(ghost: GhostProfile): Effect.Effect<void>;
    removeGhost(username: string): Effect.Effect<void>;
    /** Keep the latest gist copy on an account. */
    saveMirror(username: string, mirror: GistMirror): Effect.Effect<void>;
  }
>()('@repo/profiles/ProfileStore') {
  /** A store in memory, for tests and local development without a database. */
  static readonly memory = Layer.sync(ProfileStore, () =>
    ProfileStore.of(memoryStore(new Map()))
  );
}

/** The in-memory store over a map, exposed so tests can seed accounts. */
export const memoryStore = (
  profiles: Map<string, Profile>
): ProfileStore['Service'] => ({
  find: (username) => Effect.sync(() => profiles.get(username)),
  saveGhost: (ghost) =>
    Effect.sync(() => {
      const current = profiles.get(ghost.username);
      if (!current || current.kind === 'ghost')
        profiles.set(ghost.username, { kind: 'ghost', ...ghost });
    }),
  removeGhost: (username) =>
    Effect.sync(() => {
      if (profiles.get(username)?.kind === 'ghost') profiles.delete(username);
    }),
  saveMirror: (username, mirror) =>
    Effect.sync(() => {
      const current = profiles.get(username);
      if (current?.kind === 'account')
        profiles.set(username, { ...current, mirror });
    }),
});
